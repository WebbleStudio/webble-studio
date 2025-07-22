import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Log delle variabili d'ambiente (senza esporre i valori)
    console.log('Env check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    const body = await request.json();
    console.log('Request body received:', { ...body, message: 'REDACTED' });
    
    const { name, email, phone, message, privacyConsent, marketingConsent } = body;

    // Validazione base
    if (!name || !email || !message || !privacyConsent) {
      console.log('Validation failed:', { name: !!name, email: !!email, message: !!message, privacyConsent });
      return NextResponse.json(
        { error: 'Nome, email, messaggio e consenso privacy sono obbligatori' },
        { status: 400 }
      );
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json({ error: 'Formato email non valido' }, { status: 400 });
    }

    console.log('Attempting Supabase insert...');
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
        },
      ])
      .select();

    if (error) {
      console.error('Errore Supabase dettagliato:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ 
        error: 'Errore nel salvataggio dei dati',
        details: error.message 
      }, { status: 500 });
    }

    console.log('Supabase insert successful, attempting email send...');
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
          message,
        }),
      });
      console.log('Email sent successfully');
    } catch (emailError: any) {
      console.error('Errore dettagliato invio email:', {
        name: emailError?.name,
        message: emailError?.message,
        stack: emailError?.stack,
      });
      // Non blocchiamo il processo se l'email fallisce
      // Il form è stato salvato comunque
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Messaggio inviato con successo!',
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Errore API dettagliato:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json({ 
      error: 'Errore interno del server',
      details: error?.message 
    }, { status: 500 });
  }
}
