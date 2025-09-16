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
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#F20352',
          padding: '30px 40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            margin: '0',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          Grazie {name}!
        </h1>
        <p
          style={{
            color: 'white',
            margin: '8px 0 0 0',
            fontSize: '16px',
            opacity: 0.9,
          }}
        >
          La tua richiesta è stata ricevuta con successo
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
            margin: '0 0 24px 0',
          }}
        >
          Ciao{' '}
          <strong>
            {name} {surname}
          </strong>
          ,
        </p>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
            margin: '0 0 24px 0',
          }}
        >
          Grazie per aver scelto Webble Studio! Abbiamo ricevuto la tua richiesta per il servizio{' '}
          <strong>{service}</strong> e ti contatteremo presto tramite{' '}
          <strong>{contactMethod}</strong>.
        </p>

        {/* Dettagli richiesta */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            margin: '24px 0',
            border: '1px solid #e5e5e5',
          }}
        >
          <h3
            style={{
              color: '#F20352',
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            📋 Dettagli della tua richiesta
          </h3>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Nome:</strong> {name} {surname}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Email:</strong> {email}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Telefono:</strong> {phone}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Servizio richiesto:</strong> {service}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Metodo di contatto preferito:</strong> {contactMethod}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
            margin: '0 0 24px 0',
          }}
        >
          Il nostro team esaminerà la tua richiesta e ti risponderà entro 24 ore lavorative.
        </p>

        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
            margin: '0',
          }}
        >
          Nel frattempo, se hai domande urgenti, non esitare a contattarci direttamente.
        </p>
      </div>

      {/* CTA */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '30px 40px',
          textAlign: 'center',
          borderTop: '1px solid #e5e5e5',
        }}
      >
        <a
          href="mailto:info@webblestudio.com"
          style={{
            display: 'inline-block',
            backgroundColor: '#F20352',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          Contattaci direttamente
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#0b0b0b',
          padding: '30px 40px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: '0 0 8px 0',
          }}
        >
          © 2024 Webble Studio - Tutti i diritti riservati
        </p>
        <p
          style={{
            fontSize: '11px',
            color: '#6b7280',
            margin: '0',
          }}
        >
          Questa email è stata inviata perché hai compilato il nostro form di booking.
        </p>
      </div>
    </div>
  );
}
