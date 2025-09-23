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
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#050505',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div style={{ 
        marginBottom: '40px',
        textAlign: 'center',
        width: '100%'
      }}>
        <img 
          src="https://webblestudio.com/img/mail/logo-red.svg" 
          alt="Webble Studio" 
          style={{
            maxWidth: '90px',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </div>

      {/* Envelope */}
      <div style={{ 
        marginBottom: '40px',
        textAlign: 'center',
        width: '100%'
      }}>
        <img 
          src="https://webblestudio.com/img/mail/envelope.svg" 
          alt="Email" 
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </div>
    </div>
  );
}
