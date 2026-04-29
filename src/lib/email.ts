import { Resend } from "resend";
import BookingClientEmail from "@/components/emails/BookingClientEmail";
import BookingAdminEmail from "@/components/emails/BookingAdminEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Webble Studio <noreply@webble.studio>";

const ADMIN_EMAILS = ["webblestudio.com@gmail.com"];

export interface BookingEmailParams {
  to: string;
  name: string;
  callType: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  meetLink: string;
  message?: string;
}

export async function sendBookingConfirmation(params: BookingEmailParams): Promise<void> {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: `Prenotazione confermata — ${params.callType}`,
    react: BookingClientEmail(params),
  });
}

export async function sendBookingNotification(
  params: BookingEmailParams & { message?: string }
): Promise<void> {
  await Promise.all(
    ADMIN_EMAILS.map((adminEmail) =>
      resend.emails.send({
        from: EMAIL_FROM,
        to: adminEmail,
        subject: `Nuova prenotazione — ${params.name} · ${params.callType}`,
        react: BookingAdminEmail(params),
      })
    )
  );
}
