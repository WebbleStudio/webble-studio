import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, privacyConsent, marketingConsent } = body;

    // Validazione base
    if (!name || !email || !message || !privacyConsent) {
      return NextResponse.json(
        { error: 'Nome, email, messaggio e consenso privacy sono obbligatori' },
        { status: 400 }
      );
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      );
    }

    // Inserimento dati su Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message,
          privacy_consent: privacyConsent,
          marketing_consent: marketingConsent,
        }
      ])
      .select();

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json(
        { error: 'Errore nel salvataggio dei dati' },
        { status: 500 }
      );
    }

    // Invia email di conferma
    try {
      await resend.emails.send({
        from: 'Webble Studio <onboarding@resend.dev>',
        to: ['webblestudio.com@gmail.com'], // Email verificata per test
        subject: `Grazie ${name}! Il tuo progetto ci interessa`,
        react: ContactEmail({ 
          name, 
          email, 
          phone: phone || 'Non fornito', 
          message 
        })
      });
    } catch (emailError) {
      console.error('Errore invio email:', emailError);
      // Non blocchiamo il processo se l'email fallisce
      // Il form è stato salvato comunque
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Messaggio inviato con successo!',
        data 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Errore API:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
} 