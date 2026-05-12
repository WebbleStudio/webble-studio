const IMAGE_EXT_RE = /\.(webp|jpg|png|jpeg|svg|avif|gif)$/i;

function humanise(segment: string): string {
  return segment
    .replace(IMAGE_EXT_RE, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function altFromImagePath(src: string, suffix = "— Webble Studio"): string {
  const parts = src.split("/").filter(Boolean);
  const file = parts.pop() ?? "";
  const folder = parts.pop() ?? "";
  const fileName = humanise(file);
  const folderName = humanise(folder);
  const base =
    /^\d+$/.test(fileName) && folderName
      ? folderName
      : folderName && fileName
        ? `${folderName} — ${fileName}`
        : folderName || fileName;
  return suffix ? `${base} ${suffix}` : base;
}
