import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';
import ContactEmail from '@/components/email/ContactEmail';
import ContactAdminEmail from '@/components/email/ContactAdminEmail';
import BookingClientEmail from '@/components/email/BookingClientEmail';
import BookingAdminEmail from '@/components/email/BookingAdminEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { emailType, data } = await request.json();

    const TEST_EMAIL = 'webblestudio.com@gmail.com';

    let emailComponent;
    let subject;

    switch (emailType) {
      case 'contact-client':
        emailComponent = React.createElement(ContactEmail, data);
        subject = '🧪 TEST - Conferma ricezione messaggio - Webble Studio';
        break;
      case 'contact-admin':
        emailComponent = React.createElement(ContactAdminEmail, data);
        subject = '🧪 TEST - Nuovo messaggio di contatto';
        break;
      case 'booking-client':
        emailComponent = React.createElement(BookingClientEmail, data);
        subject = '🧪 TEST - Conferma prenotazione - Webble Studio';
        break;
      case 'booking-admin':
        emailComponent = React.createElement(BookingAdminEmail, data);
        subject = '🧪 TEST - Nuova richiesta di appuntamento';
        break;
      default:
        return NextResponse.json({ error: 'Tipo di email non valido' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'Webble Studio <noreply@webblestudio.com>',
      to: TEST_EMAIL,
      subject: subject,
      react: emailComponent,
    });

    return NextResponse.json({
      success: true,
      message: `Email di test inviata con successo a ${TEST_EMAIL}`,
      emailId: result.data?.id,
    });
  } catch (error) {
    console.error('Errore invio email di test:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Errore durante l\'invio dell\'email di test',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

