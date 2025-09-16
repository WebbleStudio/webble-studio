import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { Resend } from 'resend';
import BookingClientEmail from '@/components/email/BookingClientEmail';
import BookingAdminEmail from '@/components/email/BookingAdminEmail';
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
    const { name, surname, email, phone, services, customService, contactMethod } = body;

    // Validation
    if (
      !name ||
      !surname ||
      !email ||
      !phone ||
      !services ||
      !Array.isArray(services) ||
      services.length === 0 ||
      !contactMethod
    ) {
      throw new ApplicationError(ErrorCode.VALIDATION_ERROR, 'Tutti i campi sono obbligatori');
    }

    // Se è selezionato "altro", customService deve essere presente
    if (services.includes('altro') && (!customService || !customService.trim())) {
      throw new ApplicationError(
        ErrorCode.VALIDATION_ERROR,
        'Devi specificare il servizio personalizzato'
      );
    }

    if (!isValidEmail(email)) {
      throw new ApplicationError(ErrorCode.VALIDATION_ERROR, 'Formato email non valido');
    }

    // Prepara i dati per il database
    const bookingData: any = {
      name: sanitizeInput(name),
      surname: sanitizeInput(surname),
      email: sanitizeInput(email).toLowerCase(),
      phone: sanitizeInput(phone),
      contact_method: sanitizeInput(contactMethod),
      created_at: new Date().toISOString(),
    };

    // Aggiungi i nuovi campi se disponibili, altrimenti usa il vecchio formato
    if (services && Array.isArray(services)) {
      bookingData.services = services.map((service) => sanitizeInput(service));
      if (customService) {
        bookingData.custom_service = sanitizeInput(customService);
      }
    } else {
      // Fallback per compatibilità con vecchio schema
      bookingData.service = 'altro'; // Default fallback
    }

    try {
      // Salva nel database - usa admin se disponibile, altrimenti anonimo
      const client = supabaseAdmin || supabase;

      const { data, error } = await client
        .from('bookings')
        .insert([bookingData])
        .select('id')
        .single();

      if (error) {
        throw new ApplicationError(
          ErrorCode.DATABASE_ERROR,
          'Errore nel salvataggio dei dati',
          error
        );
      }

      // Invio email al cliente
      try {
        await resend.emails.send({
          from: 'Webble Studio <noreply@contacts.webblestudio.com>',
          to: [email],
          subject: `Grazie ${name}! La tua richiesta è stata ricevuta`,
          react: BookingClientEmail({
            name,
            surname,
            email,
            phone,
            service: customService || services.join(', '),
            contactMethod,
          }),
        });
      } catch (emailError) {
        logError(
          new ApplicationError(
            ErrorCode.EMAIL_ERROR,
            "Errore nell'invio email cliente",
            emailError
          ),
          'Booking Client Email'
        );
      }

      // Invio email all'admin
      try {
        await resend.emails.send({
          from: 'Webble Studio <noreply@contacts.webblestudio.com>',
          to: ['webblestudio.com@gmail.com'], // Email admin corretta
          subject: `Nuova richiesta di contatto da ${name} ${surname}`,
          react: BookingAdminEmail({
            name,
            surname,
            email,
            phone,
            service: customService || services.join(', '),
            contactMethod,
          }),
        });
      } catch (emailError) {
        logError(
          new ApplicationError(ErrorCode.EMAIL_ERROR, "Errore nell'invio email admin", emailError),
          'Booking Admin Email'
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Richiesta inviata con successo!',
        },
        { status: 201 }
      );
    } catch (dbError) {
      const error = new ApplicationError(ErrorCode.DATABASE_ERROR, 'Errore nel database', dbError);
      logError(error, 'Booking Form Database');
      return createErrorResponse(error, 500);
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      logError(error, 'Booking Form Validation');
      return createErrorResponse(error, error.code === ErrorCode.VALIDATION_ERROR ? 400 : 500);
    }

    const unknownError = new ApplicationError(
      ErrorCode.UNKNOWN_ERROR,
      'Errore interno del server',
      error
    );
    logError(unknownError, 'Booking Form Unknown');
    return createErrorResponse(unknownError, 500);
  }
}
