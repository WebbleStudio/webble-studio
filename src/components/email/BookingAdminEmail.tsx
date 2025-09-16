import React from 'react';

interface BookingAdminEmailProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  service: string;
  contactMethod: string;
}

export default function BookingAdminEmail({
  name,
  surname,
  email,
  phone,
  service,
  contactMethod,
}: BookingAdminEmailProps) {
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
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          📞 Nuova Richiesta di Contatto
        </h1>
        <p
          style={{
            color: 'white',
            margin: '8px 0 0 0',
            fontSize: '16px',
            opacity: 0.9,
          }}
        >
          Da: {name} {surname}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            margin: '0 0 24px 0',
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
            📋 Dettagli Richiesta
          </h3>
          <div style={{ fontSize: '14px', color: '#333' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Nome:</strong> {name} {surname}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} style={{ color: '#F20352', textDecoration: 'none' }}>
                {email}
              </a>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Telefono:</strong>{' '}
              <a href={`tel:${phone}`} style={{ color: '#F20352', textDecoration: 'none' }}>
                {phone}
              </a>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Servizio richiesto:</strong> {service}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Metodo di contatto preferito:</strong> {contactMethod}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ffeaa7',
            margin: '24px 0',
          }}
        >
          <h4
            style={{
              color: '#856404',
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            ⚡ Azione Richiesta
          </h4>
          <p
            style={{
              fontSize: '14px',
              color: '#856404',
              margin: '0',
              lineHeight: '1.5',
            }}
          >
            Contatta il cliente entro 24 ore lavorative utilizzando il metodo preferito:{' '}
            <strong>{contactMethod}</strong>
          </p>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            margin: '24px 0',
            flexWrap: 'wrap',
          }}
        >
          <a
            href={`mailto:${email}?subject=Re: Richiesta servizio ${service}&body=Ciao ${name},%0D%0A%0D%0AGrazie per aver scelto Webble Studio!%0D%0A%0D%0A`}
            style={{
              display: 'inline-block',
              backgroundColor: '#F20352',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            📧 Rispondi via Email
          </a>
          <a
            href={`tel:${phone}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            📞 Chiama
          </a>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: '#666',
            margin: '24px 0 0 0',
            fontStyle: 'italic',
          }}
        >
          Questa richiesta è stata inviata tramite il form di contatto del sito web.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#0b0b0b',
          padding: '20px 40px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: '0',
          }}
        >
          © 2024 Webble Studio - Sistema di notifica automatica
        </p>
      </div>
    </div>
  );
}
