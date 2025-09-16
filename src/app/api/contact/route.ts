import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';
import ContactAdminEmail from '@/components/email/ContactAdminEmail';
import {
  ApplicationError,
  ErrorCode,
  createErrorResponse,
  logError,
  isValidEmail,
  sanitizeInput,
} from '@/lib/errors';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, privacyConsent, marketingConsent } = body;

    // Validation
    if (!name || !email || !message || !privacyConsent) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        'Nome, email, messaggio e consenso privacy sono obbligatori'
      );
    }

    if (!isValidEmail(email)) {
      throw new ApplicationError(ErrorCode.VALIDATION_ERROR, 'Formato email non valido');
    }

    const contactData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      phone: phone ? sanitizeInput(phone) : null,
      message: sanitizeInput(message),
      privacy_consent: !!privacyConsent,
      marketing_consent: !!marketingConsent,
    };

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select('id')
        .single();

      if (error) {
        throw new ApplicationError(
          ErrorCode.DATABASE_ERROR,
          'Errore nel salvataggio dei dati',
          error
        );
      }

      // Invio email di conferma al cliente
      try {
        await resend.emails.send({
          from: 'Webble Studio <noreply@contacts.webblestudio.com>',
          to: [email],
          subject: `Grazie ${name}! Il tuo progetto ci interessa`,
          react: ContactEmail({
            name,
            email,
            phone: phone || 'Non fornito',
            message,
          }),
        });
      } catch (emailError) {
        logError(
          new ApplicationError(
            ErrorCode.EMAIL_ERROR,
            "Errore nell'invio email cliente",
            emailError
          ),
          'Contact Client Email'
        );
        // Non blocchiamo il processo se l'email fallisce
      }

      // Invio email di notifica all'admin
      try {
        await resend.emails.send({
          from: 'Webble Studio <noreply@contacts.webblestudio.com>',
          to: ['webblestudio.com@gmail.com'],
          subject: `${name} ha compilato il form`,
          react: ContactAdminEmail({
            name,
            email,
            phone: phone || 'Non fornito',
            message,
          }),
        });
      } catch (emailError) {
        logError(
          new ApplicationError(ErrorCode.EMAIL_ERROR, "Errore nell'invio email admin", emailError),
          'Contact Admin Email'
        );
        // Non blocchiamo il processo se l'email fallisce
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Messaggio inviato con successo!',
        },
        { status: 201 }
      );
    } catch (dbError) {
      const error = new ApplicationError(ErrorCode.DATABASE_ERROR, 'Errore nel database', dbError);
      logError(error, 'Contact Form Database');
      return createErrorResponse(error, 500);
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      logError(error, 'Contact Form Validation');
      return createErrorResponse(error, error.code === ErrorCode.VALIDATION_ERROR ? 400 : 500);
    }

    const unknownError = new ApplicationError(
      ErrorCode.UNKNOWN_ERROR,
      'Errore interno del server',
      error
    );
    logError(unknownError, 'Contact Form Unknown');
    return createErrorResponse(unknownError, 500);
  }
}
