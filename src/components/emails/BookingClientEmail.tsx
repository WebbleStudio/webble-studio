import type { BookingEmailParams } from "@/lib/email";

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function BookingClientEmail({
  name,
  callType,
  date,
  startTime,
  endTime,
  meetLink,
}: BookingEmailParams) {
  const shortDate = formatShortDate(date);
  const firstName = name.trim().split(/\s+/)[0] ?? name;

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
                    <p style={{ margin: 0, color: "#888", fontSize: 13 }}>Webble Studio</p>
                    <h1 style={{ margin: "8px 0 0", color: "#ededed", fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
                      Ciao {firstName}!
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "#aaa", fontSize: 15 }}>
                      La tua prenotazione è confermata.
                    </p>
                  </td>
                </tr>

                {/* Details card */}
                <tr>
                  <td style={{ padding: "28px 40px 0" }}>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ backgroundColor: "#111113", borderRadius: 6, overflow: "hidden" }}
                    >
                      <tr>
                        <td style={{ padding: "20px 24px", borderBottom: "1px solid #2a2a2e" }} colSpan={2}>
                          <p style={{ margin: 0, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Tipo di call</p>
                          <p style={{ margin: "6px 0 0", color: "#ededed", fontSize: 15, fontWeight: 600 }}>{callType}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "20px 24px", width: "50%" }}>
                          <p style={{ margin: 0, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Data</p>
                          <p style={{ margin: "6px 0 0", color: "#ededed", fontSize: 15, fontWeight: 600 }}>{shortDate}</p>
                        </td>
                        <td style={{ padding: "20px 24px", width: "50%", borderLeft: "1px solid #2a2a2e" }}>
                          <p style={{ margin: 0, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Orario</p>
                          <p style={{ margin: "6px 0 0", color: "#ededed", fontSize: 15, fontWeight: 600 }}>{startTime} – {endTime}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* CTA */}
                <tr>
                  <td style={{ padding: "28px 40px 0", textAlign: "center" }}>
                    <a
                      href={meetLink}
                      style={{
                        display: "inline-block",
                        backgroundColor: "#e2ff00",
                        color: "#111",
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                        padding: "14px 32px",
                        borderRadius: 4,
                      }}
                    >
                      Unisciti alla Google Meet
                    </a>
                  </td>
                </tr>

                {/* Next steps */}
                <tr>
                  <td style={{ padding: "28px 40px 0" }}>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ backgroundColor: "#111113", borderRadius: 6 }}
                    >
                      <tr>
                        <td style={{ padding: "20px 24px" }}>
                          <p style={{ margin: "0 0 12px", color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>I prossimi passi</p>
                          {[
                            "Riceverai una Google Calendar invite via email.",
                            "Preparati con domande e obiettivi chiari.",
                            "Accedi al link Meet qualche minuto prima.",
                            "Dopo la call ti invieremo un riepilogo e i prossimi step.",
                          ].map((step, i) => (
                            <p key={i} style={{ margin: "0 0 8px", color: "#aaa", fontSize: 14, paddingLeft: 16, position: "relative" }}>
                              <span style={{ color: "#e2ff00", fontWeight: 700, marginRight: 8 }}>→</span>
                              {step}
                            </p>
                          ))}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: "28px 40px 32px", borderTop: "1px solid #2a2a2e", marginTop: 28 }}>
                    <p style={{ margin: 0, color: "#555", fontSize: 12, textAlign: "center" }}>
                      <a href="https://webble.studio" style={{ color: "#888", textDecoration: "none" }}>webble.studio</a>
                      {" · "}© {new Date().getFullYear()} Webble Studio
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
