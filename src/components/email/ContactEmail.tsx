import React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactEmail({ name, email, phone, message }: ContactEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Figtree', Arial, sans-serif",
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0',
        backgroundColor: '#fafafa',
        lineHeight: '1.6',
      }}
    >
      {/* Header con Logo */}
      <div
        style={{
          backgroundColor: '#0B0B0B',
          padding: '40px 40px 30px 40px',
          textAlign: 'center',
        }}
      >
        {/* Immagine profilo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fafafa 0%, #e5e5e5 100%)',
            margin: '0 auto 20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#0b0b0b',
            border: '3px solid #fafafa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #0b0b0b 0%, #333 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            WS
          </span>
        </div>

        <h1
          style={{
            color: '#fafafa',
            fontSize: '32px',
            margin: '0 0 8px 0',
            fontWeight: '600',
            letterSpacing: '-0.5px',
          }}
        >
          Webble Studio
        </h1>
        <p
          style={{
            color: '#fafafa',
            fontSize: '16px',
            margin: '0',
            opacity: '0.8',
          }}
        >
          Progettiamo esperienze che lasciano il segno
        </p>
      </div>

      {/* Contenuto principale */}
      <div style={{ padding: '40px' }}>
        {/* Saluto personalizzato */}
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              color: '#0b0b0b',
              fontSize: '28px',
              margin: '0 0 16px 0',
              fontWeight: '600',
            }}
          >
            Ciao {name}! 👋
          </h2>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#333',
              margin: '0',
            }}
          >
            Grazie per aver scelto <strong>Webble Studio</strong>! Abbiamo ricevuto la tua richiesta
            e siamo entusiasti di trasformare la tua visione in realtà digitale.
          </p>
        </div>

        {/* Box dettagli richiesta */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            margin: '32px 0',
            border: '1px solid #e5e5e5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <h3
            style={{
              margin: '0 0 20px 0',
              color: '#0b0b0b',
              fontSize: '20px',
              fontWeight: '600',
            }}
          >
            📝 Dettagli della tua richiesta
          </h3>

          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: '4px solid #0b0b0b',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontStyle: 'italic',
                color: '#555',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0',
              }}
            >
              {message}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                fontSize: '15px',
              }}
            >
              <strong style={{ color: '#0b0b0b' }}>📧 Email:</strong>
              <span style={{ marginLeft: '8px', color: '#666' }}>{email}</span>
            </div>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                fontSize: '15px',
              }}
            >
              <strong style={{ color: '#0b0b0b' }}>📱 Telefono:</strong>
              <span style={{ marginLeft: '8px', color: '#666' }}>{phone}</span>
            </div>
          </div>
        </div>

        {/* Cosa succede ora */}
        <div
          style={{
            backgroundColor: '#f0f9ff',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid #0ea5e9',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              color: '#0b0b0b',
              fontSize: '20px',
              margin: '0 0 16px 0',
              fontWeight: '600',
            }}
          >
            🚀 I prossimi passi
          </h3>
          <div style={{ color: '#374151' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
              <strong>Entro 24 ore</strong> il nostro team ti contatterà per:
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '15px' }}>
              <li style={{ marginBottom: '8px' }}>Analizzare in dettaglio il tuo progetto</li>
              <li style={{ marginBottom: '8px' }}>Definire la strategia migliore</li>
              <li style={{ marginBottom: '8px' }}>Prepararti un preventivo personalizzato</li>
              <li style={{ marginBottom: '0' }}>Pianificare i tempi di realizzazione</li>
            </ul>
          </div>
        </div>

        {/* Servizi highlight */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#0b0b0b',
              fontSize: '18px',
              margin: '0 0 20px 0',
              fontWeight: '600',
            }}
          >
            💡 I nostri servizi
          </h3>
          <div
            style={{
              display: 'grid',
              gap: '12px',
              fontSize: '14px',
            }}
          >
            {[
              '🎨 UI/UX Design',
              '⚡ Sviluppo Web',
              '📱 App Mobile',
              '🚀 E-commerce',
              '📊 Analytics & SEO',
            ].map((service, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                }}
              >
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a
            href="https://webble.studio"
            style={{
              backgroundColor: '#0b0b0b',
              color: 'white',
              padding: '16px 32px',
              textDecoration: 'none',
              borderRadius: '8px',
              display: 'inline-block',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.3s',
            }}
          >
            🌐 Scopri il nostro portfolio
          </a>
        </div>

        {/* Contatti */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
          }}
        >
          <h4
            style={{
              color: '#0b0b0b',
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Hai domande? Siamo qui per te!
          </h4>
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            📧{' '}
            <a
              href="mailto:info@webblestudio.com"
              style={{ color: '#0b0b0b', textDecoration: 'none' }}
            >
              info@webblestudio.com
            </a>
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            📱 +39 123 456 7890
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '30px 40px',
          textAlign: 'center',
          borderTop: '1px solid #e5e5e5',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '0 0 8px 0',
          }}
        >
          © 2024 Webble Studio - Tutti i diritti riservati
        </p>
        <p
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            margin: '0',
          }}
        >
          Questa email è stata inviata perché hai compilato il nostro form di contatto.
        </p>
      </div>
    </div>
  );
}
