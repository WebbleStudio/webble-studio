const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurazione per test locale (usa Mailtrap, Ethereal, o simili)
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailtrap.io', // o il tuo servizio di test
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// Dati di test
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'Test Company',
  phone: '+39 123 456 7890',
  message: 'Messaggio di test per verificare il template email.',
  services: ['Web Design', 'Digital Marketing'],
  budget: '€5.000 - €10.000',
  timeline: '3-6 mesi'
};

async function testEmail() {
  try {
    // Simula il rendering del componente React (dovresti usare ReactDOMServer in produzione)
    const emailHtml = `
      <html>
        <body>
          <h1>Test Email</h1>
          <p>Nome: ${testData.name}</p>
          <p>Email: ${testData.email}</p>
          <p>Messaggio: ${testData.message}</p>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: '"Webble Studio" <noreply@webblestudio.com>',
      to: 'test@example.com',
      subject: 'Test Email - Richiesta Contatto',
      html: emailHtml
    });

    console.log('Email inviata:', info.messageId);
  } catch (error) {
    console.error('Errore invio email:', error);
  }
}

testEmail();
