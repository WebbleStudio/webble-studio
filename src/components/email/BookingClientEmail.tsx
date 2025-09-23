import React from 'react';

interface BookingClientEmailProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  service: string;
  contactMethod: string;
}

export default function BookingClientEmail({
  name,
  surname,
  email,
  phone,
  service,
  contactMethod,
}: BookingClientEmailProps) {

  return (
    <div
      className="mobile-container"
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#050505',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '0px',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div
        style={{
          marginBottom: '40px',
          textAlign: 'center',
          width: '100%',
          paddingTop: '40px',
        }}
      >
        <img
          src="https://webblestudio.com/img/mail/logo-red.png"
          alt="Webble Studio"
          width="90"
          height="auto"
          style={{
            maxWidth: '90px',
            height: 'auto',
            display: 'block',
            margin: '10px auto 0 auto',
            border: 'none',
          }}
        />
      </div>

      {/* Envelope */}
      <div
        style={{
          marginBottom: '40px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <img
          src="https://webblestudio.com/img/mail/envelope.png"
          alt="Email"
          width="100%"
          height="auto"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            border: 'none',
          }}
        />
      </div>

      {/* Content Section - Full Width */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#fafafa',
            fontSize: '28px',
            fontWeight: 'normal',
            margin: '0 0 20px 0',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal' }}>Ciao </span>
          <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>{name}</span>
        </h1>
        
        <p
          style={{
            color: '#fafafa',
            opacity: '0.6',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 auto',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 'normal',
            maxWidth: '390px',
          }}
        >
          Grazie per aver scelto Webble Studio!<br />
          Abbiamo ricevuto la tua richiesta e siamo entusiasti di
          trasformare la tua visione in realtà digitale.
        </p>
      </div>

    </div>
  );
}
