/**
 * Server-side guards for /api/chat: rate limit (in-memory), origin allowlist, prompt injection heuristics.
 */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

type TimestampBucket = number[];

const ipBuckets = new Map<string, TimestampBucket>();

function pruneOldTimestamps(timestamps: TimestampBucket, now: number): TimestampBucket {
  return timestamps.filter((t) => now - t < RATE_WINDOW_MS);
}

/** Returns true if the request is allowed, false if rate limited. */
export function checkChatRateLimit(ip: string): boolean {
  const now = Date.now();
  let timestamps = ipBuckets.get(ip);
  if (!timestamps) {
    timestamps = [];
    ipBuckets.set(ip, timestamps);
  }
  const pruned = pruneOldTimestamps(timestamps, now);
  if (pruned.length >= RATE_MAX) {
    ipBuckets.set(ip, pruned);
    return false;
  }
  pruned.push(now);
  ipBuckets.set(ip, pruned);

  // Best-effort memory cap: drop oldest entries if map grows too large
  if (ipBuckets.size > 5000) {
    const keys = [...ipBuckets.keys()].slice(0, 2500);
    for (const k of keys) ipBuckets.delete(k);
  }
  return true;
}

const LEAD_RATE_WINDOW_MS = 300_000; // 5 min
const LEAD_RATE_MAX = 8;
const leadIpBuckets = new Map<string, TimestampBucket>();

function pruneLeadTimestamps(timestamps: TimestampBucket, now: number): TimestampBucket {
  return timestamps.filter((t) => now - t < LEAD_RATE_WINDOW_MS);
}

/** Rate limit for /api/chat-lead (separate bucket from chat). */
export function checkChatLeadRateLimit(ip: string): boolean {
  const now = Date.now();
  let timestamps = leadIpBuckets.get(ip);
  if (!timestamps) {
    timestamps = [];
    leadIpBuckets.set(ip, timestamps);
  }
  const pruned = pruneLeadTimestamps(timestamps, now);
  if (pruned.length >= LEAD_RATE_MAX) {
    leadIpBuckets.set(ip, pruned);
    return false;
  }
  pruned.push(now);
  leadIpBuckets.set(ip, pruned);
  if (leadIpBuckets.size > 2000) {
    const keys = [...leadIpBuckets.keys()].slice(0, 1000);
    for (const k of keys) leadIpBuckets.delete(k);
  }
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "unknown";
}

function normalizeOrigin(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

/** Allowed hosts for Origin / Referer (without port comparison for standard ports). */
function getAllowedHosts(): Set<string> {
  const hosts = new Set<string>();
  hosts.add("localhost");
  hosts.add("127.0.0.1");

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webble.studio";
  const siteUrl = normalizeOrigin(site);
  if (siteUrl) hosts.add(siteUrl.hostname);

  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    try {
      hosts.add(new URL(`https://${vercel}`).hostname);
    } catch {
      hosts.add(vercel.replace(/^https?:\/\//, "").split("/")[0] || "");
    }
  }

  const extra = process.env.CHAT_ALLOWED_ORIGINS;
  if (extra) {
    for (const part of extra.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const u = normalizeOrigin(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      if (u) hosts.add(u.hostname);
    }
  }

  return hosts;
}

/**
 * Same-origin browser requests include Origin. Allow only known hosts.
 * Missing Origin/Referer → reject (blocks naive curl/scripts without spoofing).
 */
export function isChatOriginAllowed(req: Request): boolean {
  const allowed = getAllowedHosts();
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const tryUrl = (value: string | null): boolean => {
    if (!value) return false;
    const u = normalizeOrigin(value);
    if (!u) return false;
    return allowed.has(u.hostname);
  };

  if (tryUrl(origin)) return true;
  if (tryUrl(referer)) return true;
  return false;
}

const INJECTION_PATTERNS = [
  /\bignora\s+(le\s+)?istruzioni/i,
  /\bforget\s+(your\s+)?(instructions|rules)\b/i,
  /\bignore\s+(all\s+)?(previous|prior)\s+(instructions|rules)\b/i,
  /\bact\s+as\b/i,
  /\bpretend\s+(you\s+are|to\s+be)\b/i,
  /\bjailbreak\b/i,
  /\bDAN\s+mode\b/i,
  /\bsystem\s*:\s*/i,
  /\boverride\s+(the\s+)?(system|instructions)\b/i,
  /\bdisregard\s+(the\s+)?(above|previous)\b/i,
];

export function looksLikePromptInjection(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  for (const re of INJECTION_PATTERNS) {
    if (re.test(lower)) return true;
  }
  return false;
}

export const INJECTION_REFUSAL_IT =
  "Non posso elaborare questa richiesta. Se ha domande su Webble Studio, le rispondo volentieri in modo breve e professionale.";

