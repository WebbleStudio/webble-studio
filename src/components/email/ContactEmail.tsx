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
        colorScheme: 'light',
        color: '#fafafa',
      }}
      data-color-scheme="light"
      data-ogsc="light"
    >
      {/* Preview text for Gmail - hidden but helps with truncation */}
      <div
        style={{
          display: 'none',
          fontSize: '0',
          lineHeight: '0',
          maxHeight: '0',
          overflow: 'hidden',
        }}
      >
        Grazie per averci contattato! Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.
      </div>

      {/* Envelope */}
      <div
        style={{
          marginBottom: '10px',
          textAlign: 'center',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src={`https://webblestudio.com/img/mail/envelope.png?v=${Date.now()}`}
          alt="Email"
          width="100%"
          height="auto"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            marginTop: '20px',
            marginBottom: '0',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: 'none',
          }}
        />
      </div>

      {/* Content Section - Full Width */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '20px 0',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#fafafa',
            fontSize: '28px',
            fontWeight: 'normal',
            margin: '0 auto 10px auto',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'block',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal' }}>
            Ciao{' '}
          </span>
          <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
            {name}
          </span>
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
            display: 'block',
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          Grazie per aver scelto Webble Studio!
          <br />
          Abbiamo ricevuto il tuo messaggio e siamo entusiasti di trasformare la tua visione in
          realtà digitale.
        </p>
      </div>

      {/* Main Container Section */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '20px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Message Container */}
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(250, 250, 250, 0.20)',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            margin: '0 auto',
            boxSizing: 'border-box',
            padding: '20px',
          }}
        >
          <h2
            style={{
              color: '#fafafa',
              fontSize: '18px',
              fontWeight: '500',
              margin: '0 0 20px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Il tuo messaggio:
          </h2>

          {/* Message text container */}
          <div
            style={{
              width: '100%',
              minHeight: '80px',
              border: '1px solid rgba(250, 250, 250, 0.20)',
              borderRadius: '12px',
              backgroundColor: 'rgba(217, 217, 217, 0.05)',
              margin: '10px 0',
              boxSizing: 'border-box',
              padding: '15px',
            }}
          >
            <p
              style={{
                color: '#fafafa',
                fontSize: '14px',
                fontWeight: '400',
                margin: '0',
                fontFamily: 'Arial, Helvetica, sans-serif',
                textAlign: 'left',
                lineHeight: '1.6',
                opacity: '0.9',
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Personal Data Container */}
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(250, 250, 250, 0.20)',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            margin: '20px auto 0 auto',
            boxSizing: 'border-box',
            padding: '20px',
          }}
        >
          <h2
            style={{
              color: '#fafafa',
              fontSize: '18px',
              fontWeight: '500',
              margin: '0 0 20px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Dati personali:
          </h2>

          {/* Two 100% width containers */}
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: '100%',
                height: '50px',
                border: '1px solid rgba(250, 250, 250, 0.20)',
                borderRadius: '12px',
                backgroundColor: 'rgba(217, 217, 217, 0.05)',
                boxSizing: 'border-box',
                padding: '15px',
                lineHeight: '20px',
                marginBottom: '10px',
              }}
            >
              <h3
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: '0',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                }}
              >
                {email}
              </h3>
            </div>
            <div
              style={{
                width: '100%',
                height: '50px',
                border: '1px solid rgba(250, 250, 250, 0.20)',
                borderRadius: '12px',
                backgroundColor: 'rgba(217, 217, 217, 0.05)',
                boxSizing: 'border-box',
                padding: '15px',
                lineHeight: '20px',
              }}
            >
              <h3
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: '0',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  textAlign: 'left',
                }}
              >
                {phone}
              </h3>
            </div>
          </div>
        </div>

        {/* Next Steps Container */}
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(250, 250, 250, 0.20)',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            margin: '20px auto 0 auto',
            boxSizing: 'border-box',
            padding: '20px',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            <h2
              style={{
                color: '#fafafa',
                fontSize: '18px',
                fontWeight: '500',
                margin: '0',
                fontFamily: 'Arial, Helvetica, sans-serif',
                textAlign: 'center',
              }}
            >
              I prossimi passi!
            </h2>
          </div>

          <h3
            style={{
              color: '#fafafa',
              fontSize: '14px',
              fontWeight: '500',
              margin: '0 0 15px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'left',
            }}
          >
            <span style={{ opacity: '1' }}>Entro 24 ore</span>{' '}
            <span style={{ opacity: '0.6' }}>il nostro team ti contatterà per:</span>
          </h3>

          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '8px', overflow: 'hidden' }}>
              <span
                style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}
              >
                •
              </span>
              <span
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                Analizzare in dettaglio il tuo progetto
              </span>
            </div>
            <div style={{ marginBottom: '8px', overflow: 'hidden' }}>
              <span
                style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}
              >
                •
              </span>
              <span
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                Definire la strategia migliore
              </span>
            </div>
            <div style={{ marginBottom: '8px', overflow: 'hidden' }}>
              <span
                style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}
              >
                •
              </span>
              <span
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                Prepararti un preventivo personalizzato
              </span>
            </div>
            <div style={{ marginBottom: '8px', overflow: 'hidden' }}>
              <span
                style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}
              >
                •
              </span>
              <span
                style={{
                  color: '#fafafa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
              >
                Pianificare i tempi di realizzazione
              </span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#050505',
            padding: '80px 20px 10px 20px',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              color: 'rgba(250, 250, 250, 0.60)',
              fontSize: '14px',
              fontWeight: 'normal',
              margin: '0 0 4px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Hai domande? Siamo qui per te!
          </p>

          <p
            style={{
              color: '#fafafa',
              fontSize: '14px',
              fontWeight: 'normal',
              margin: '0 0 4px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            <a
              href="https://webblestudio.com/contatti"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#fafafa',
                textDecoration: 'underline',
                textDecorationColor: '#fafafa',
              }}
            >
              webblestudio.com/contatti
            </a>
          </p>

          <p
            style={{
              color: '#fafafa',
              fontSize: '14px',
              fontWeight: 'normal',
              margin: '0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            <a
              href="tel:+393534248308"
              style={{
                color: '#fafafa',
                textDecoration: 'none',
              }}
            >
              +39 353 424 8308
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
