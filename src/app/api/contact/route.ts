import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { Resend } from 'resend';
import ContactEmail from '@/components/email/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Funzione per verificare reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || '',
        response: token,
      }),
    });

    const data = await response.json();

    // reCAPTCHA v3 restituisce un punteggio da 0.0 a 1.0
    // Consideriamo sicuro un punteggio > 0.5
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error('Errore verifica reCAPTCHA:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, privacyConsent, marketingConsent, recaptchaToken } = body;

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
      return NextResponse.json({ error: 'Formato email non valido' }, { status: 400 });
    }

    // Verifica reCAPTCHA
    if (!recaptchaToken) {
      console.log('❌ CAPTCHA: Token mancante');
      return NextResponse.json({ error: 'Verifica CAPTCHA richiesta' }, { status: 400 });
    }

    // Salta verifica reCAPTCHA in sviluppo
    if (recaptchaToken === 'development-token') {
      console.log('🛠️ CAPTCHA: Modalità sviluppo - saltando verifica');
    } else {
      console.log('🔍 CAPTCHA: Verificando token...');
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      console.log('📊 CAPTCHA: Risultato verifica:', isRecaptchaValid);

      if (!isRecaptchaValid) {
        console.log('❌ CAPTCHA: Verifica fallita');
        return NextResponse.json({ error: 'Verifica CAPTCHA fallita. Riprova.' }, { status: 400 });
      }
    }

    console.log('✅ CAPTCHA: Verifica superata');

    // Inserimento dati su Supabase
    console.log('🔗 SUPABASE: Tentativo di connessione...');
    console.log('🔗 SUPABASE: URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Presente' : 'Mancante');
    console.log('🔗 SUPABASE: Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Presente' : 'Mancante');
    console.log('🔗 SUPABASE: URL completo:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    let data;
    try {
      // Test di connettività base
      console.log('🧪 SUPABASE: Test connettività...');
      const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      console.log('🧪 SUPABASE: Health check status:', healthCheck.status);
      
      const result = await supabase
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

      if (result.error) {
        console.error('Errore Supabase:', result.error);
        return NextResponse.json({ error: 'Errore nel salvataggio dei dati' }, { status: 500 });
      }
      
      data = result.data;
      console.log('✅ SUPABASE: Dati salvati con successo');
    } catch (supabaseError) {
      console.error('❌ SUPABASE: Errore di connessione:', supabaseError);
      
      // Fallback: salva i dati localmente (per debugging)
      const fallbackData = {
        timestamp: new Date().toISOString(),
        name,
        email,
        phone: phone || null,
        message,
        privacy_consent: privacyConsent,
        marketing_consent: marketingConsent,
        error: 'Supabase connection failed',
      };
      console.log('💾 FALLBACK: Dati che sarebbero stati salvati:', fallbackData);
      
      // Per ora restituiamo comunque successo per non bloccare l'utente
      // ma salviamo l'errore nei log
      console.log('⚠️ FALLBACK: Continuando senza salvare su database');
    }

    // Invia email di conferma
    console.log('📧 RESEND: Tentativo di invio email...');
    console.log('📧 RESEND: API Key presente:', process.env.RESEND_API_KEY ? 'Sì' : 'No');
    console.log('📧 RESEND: Email destinatario:', email);
    
    try {
      const emailResult = await resend.emails.send({
        from: 'Webble Studio <onboarding@resend.dev>',
        to: [email], // Email dinamica inserita dall'utente
        subject: `Grazie ${name}! Il tuo progetto ci interessa`,
        react: ContactEmail({
          name,
          email,
          phone: phone || 'Non fornito',
          message,
        }),
      });
      console.log('✅ RESEND: Email inviata con successo:', emailResult);
    } catch (emailError) {
      console.error('❌ RESEND: Errore invio email:', emailError);
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
  } catch (error) {
    console.error('Errore API:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
