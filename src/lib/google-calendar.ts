import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN!;
const calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary";

const TIMEZONE = "Europe/Rome";

const WORK_WINDOWS = [
  { start: 10, end: 12 }, // 10:00–12:00
  { start: 15, end: 17 }, // 15:00–17:00
];

function getAuth() {
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  return auth;
}

/**
 * Converts a YYYY-MM-DD + HH:MM pair to a proper ISO-8601 string
 * with the correct CET (+01:00) or CEST (+02:00) offset.
 * Using Intl.DateTimeFormat to detect DST avoids the fixed +01:00 mistake.
 */
export function toRomeISO(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  // Build a UTC date at noon to probe DST status for that calendar date
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(probe);
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  // offsetPart looks like "GMT+2" or "GMT+1"
  const match = offsetPart.match(/GMT([+-]\d+)/);
  const offsetHours = match ? parseInt(match[1], 10) : 1;
  const offsetStr = offsetHours >= 0 ? `+${String(offsetHours).padStart(2, "0")}:00` : `-${String(Math.abs(offsetHours)).padStart(2, "0")}:00`;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date}T${pad(hours)}:${pad(minutes)}:00${offsetStr}`;
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string;   // HH:MM
}

export async function getAvailableSlots(
  date: string,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const slots: TimeSlot[] = [];

  for (const window of WORK_WINDOWS) {
    const windowStartISO = toRomeISO(date, `${String(window.start).padStart(2, "0")}:00`);
    const windowEndISO = toRomeISO(date, `${String(window.end).padStart(2, "0")}:00`);

    // Query freebusy for this window
    const freebusyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: windowStartISO,
        timeMax: windowEndISO,
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busy = freebusyRes.data.calendars?.[calendarId]?.busy ?? [];

    // Step size: min(duration, 30) minutes
    const stepMinutes = Math.min(durationMinutes, 30);
    const windowStartMinutes = window.start * 60;
    const windowEndMinutes = window.end * 60;

    for (
      let cursor = windowStartMinutes;
      cursor + durationMinutes <= windowEndMinutes;
      cursor += stepMinutes
    ) {
      const slotEnd = cursor + durationMinutes;

      // Convert cursor to HH:MM
      const startH = Math.floor(cursor / 60);
      const startM = cursor % 60;
      const endH = Math.floor(slotEnd / 60);
      const endM = slotEnd % 60;

      const slotStartISO = toRomeISO(
        date,
        `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`
      );
      const slotEndISO = toRomeISO(
        date,
        `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`
      );

      // Conflict check
      const hasConflict = busy.some((b) => {
        const busyStart = new Date(b.start!).getTime();
        const busyEnd = new Date(b.end!).getTime();
        const sStart = new Date(slotStartISO).getTime();
        const sEnd = new Date(slotEndISO).getTime();
        return sStart < busyEnd && sEnd > busyStart;
      });

      if (!hasConflict) {
        slots.push({
          start: `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`,
          end: `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`,
        });
      }
    }
  }

  return slots;
}

export async function isSlotAvailable(
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startISO = toRomeISO(date, startTime);
  const endISO = toRomeISO(date, endTime);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: startISO,
      timeMax: endISO,
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  const sStart = new Date(startISO).getTime();
  const sEnd = new Date(endISO).getTime();

  return !busy.some((b) => {
    const busyStart = new Date(b.start!).getTime();
    const busyEnd = new Date(b.end!).getTime();
    return sStart < busyEnd && sEnd > busyStart;
  });
}

export interface CreateEventParams {
  summary: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  attendeeEmail: string;
}

export async function createCalendarEvent(params: CreateEventParams): Promise<{
  meetLink: string;
  eventId: string;
}> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startISO = toRomeISO(params.date, params.startTime);
  const endISO = toRomeISO(params.date, params.endTime);

  const res = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: params.attendeeEmail ? "all" : "none",
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: { dateTime: startISO, timeZone: TIMEZONE },
      end: { dateTime: endISO, timeZone: TIMEZONE },
      attendees: [{ email: params.attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
  });

  const meetLink = res.data.hangoutLink ?? "";
  const eventId = res.data.id ?? "";
  return { meetLink, eventId };
}
