import type { BookingEmailParams } from "@/lib/email";

function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookingAdminEmail({
  name,
  to: clientEmail,
  callType,
  date,
  startTime,
  endTime,
  meetLink,
  message,
}: BookingEmailParams & { message?: string }) {
  const longDate = formatLongDate(date);

  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#141416", fontFamily: "sans-serif" }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#141416" }}>
          <tr>
            <td align="center" style={{ padding: "40px 16px" }}>
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ maxWidth: 560, backgroundColor: "#1a1a1c", borderRadius: 8, overflow: "hidden" }}
              >
                {/* Accent stripe */}
                <tr>
                  <td style={{ height: 7, backgroundColor: "#e2ff00" }} />
                </tr>

                {/* Header */}
                <tr>
                  <td style={{ padding: "36px 40px 0" }}>
                    <p style={{ margin: 0, color: "#888", fontSize: 13 }}>Sistema di notifica — Webble Studio</p>
                    <h1 style={{ margin: "8px 0 0", color: "#ededed", fontSize: 22, fontWeight: 700 }}>
                      Richiesta da {name}
                    </h1>
                    <p style={{ margin: "6px 0 0", color: "#aaa", fontSize: 14 }}>
                      Un cliente ha richiesto <strong style={{ color: "#ededed" }}>{callType}</strong>
                    </p>
                  </td>
                </tr>

                {/* Details */}
                <tr>
                  <td style={{ padding: "24px 40px 0" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#111113", borderRadius: 6 }}>
                      {[
                        ["Nome", name],
                        ["Email", clientEmail],
                        ["Tipo call", callType],
                        ["Data", longDate],
                        ["Orario", `${startTime} – ${endTime}`],
                        ["Google Meet", meetLink],
                        ...(message ? [["Messaggio", message] as [string, string]] : []),
                      ].map(([label, value], i, arr) => (
                        <tr key={label}>
                          <td
                            style={{
                              padding: "14px 24px",
                              width: "35%",
                              borderBottom: i < arr.length - 1 ? "1px solid #2a2a2e" : "none",
                              verticalAlign: "top",
                            }}
                          >
                            <p style={{ margin: 0, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
                          </td>
                          <td
                            style={{
                              padding: "14px 24px",
                              borderBottom: i < arr.length - 1 ? "1px solid #2a2a2e" : "none",
                              borderLeft: "1px solid #2a2a2e",
                              verticalAlign: "top",
                            }}
                          >
                            <p style={{ margin: 0, color: "#ededed", fontSize: 14, wordBreak: "break-all" }}>{value}</p>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </td>
                </tr>

                {/* Action buttons */}
                <tr>
                  <td style={{ padding: "24px 40px 0", textAlign: "center" }}>
                    <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
                      <tr>
                        <td style={{ paddingRight: 8 }}>
                          <a
                            href={`mailto:${clientEmail}`}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#2a2a2e",
                              color: "#ededed",
                              fontSize: 13,
                              fontWeight: 700,
                              textDecoration: "none",
                              padding: "12px 24px",
                              borderRadius: 4,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            Contatta
                          </a>
                        </td>
                        <td style={{ paddingLeft: 8 }}>
                          <a
                            href={meetLink}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#e2ff00",
                              color: "#111",
                              fontSize: 13,
                              fontWeight: 700,
                              textDecoration: "none",
                              padding: "12px 24px",
                              borderRadius: 4,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            Join Meet
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: "28px 40px 32px" }}>
                    <p style={{ margin: 0, color: "#555", fontSize: 12, textAlign: "center" }}>
                      Sistema di notifica automatica Webble Studio · © {new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
