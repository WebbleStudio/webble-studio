import React from 'react';

interface BookingClientEmailProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  service: string;
  contactMethod: string;
  date?: string;
}

export default function BookingClientEmail({
  name,
  surname,
  email,
  phone,
  service,
  contactMethod,
  date,
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
        colorScheme: 'light',
        // Forza la modalità chiara per prevenire l'inversione in dark mode
        color: '#fafafa',
      }}
    >

      {/* Envelope */}
      <div
        style={{
          marginBottom: '10px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <img
          src="https://webblestudio.com/img/mail/envelope.png"
          alt="Email"
          width="110%"
          height="auto"
          style={{
            width: '110%',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            border: 'none',
            marginLeft: '-5%',
            marginRight: '-5%',
          }}
        />
      </div>

      {/* Content Section - Full Width */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '40px 0',
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
            display: 'block',
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          Grazie per aver scelto Webble Studio!<br />
          Abbiamo ricevuto la tua richiesta e siamo entusiasti di
          trasformare la tua visione in realtà digitale.
        </p>
      </div>

      {/* New Container Section */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '20px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
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
              fontWeight: '600',
              margin: '0 0 20px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Dettagli richiesta:
          </h2>

          {/* Full width container - 50px height */}
          <div
            style={{
              width: '100%',
              height: '50px',
              border: '1px solid rgba(250, 250, 250, 0.20)',
              borderRadius: '12px',
              backgroundColor: 'rgba(217, 217, 217, 0.05)',
              margin: '10px 0',
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
              {contactMethod?.toLowerCase() === 'email' && 'Contatto via mail'}
              {contactMethod?.toLowerCase() === 'phone' && 'Contatto telefonico'}
              {contactMethod?.toLowerCase() === 'meet' && 'Chiamata Meet/Zoom'}
              {contactMethod?.toLowerCase() === 'telefono' && 'Contatto telefonico'}
              {contactMethod?.toLowerCase() === 'chiamata' && 'Chiamata Meet/Zoom'}
            </h3>
          </div>

          {/* Two containers in row - 50px height each */}
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '10px' }}>
            <tr>
              <td width="50%" style={{ width: '50%', verticalAlign: 'top' }}>
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
                    {
                      service?.toLowerCase() === 'sito web' && 'Sito Web'
                      || service?.toLowerCase() === 'advertising' && 'Advertising'
                      || service?.toLowerCase() === 'social media' && 'Social Media'
                      || service?.toLowerCase() === 'altro' && 'Altro'
                      || service
                    }
                  </h3>
                </div>
              </td>
              <td width="50%" style={{ width: '50%', verticalAlign: 'top' }}>
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
                    {date || new Date().toLocaleDateString('it-IT')}
                  </h3>
                </div>
              </td>
            </tr>
          </table>
        </div>

        {/* Second Container Section - Duplicate */}
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
              fontWeight: '600',
              margin: '0 0 20px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Dati Personali:
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

        {/* Third Container Section - I prossimi passi */}
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
                fontWeight: '600',
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
            <span style={{ opacity: '1' }}>Entro 24 ore</span> <span style={{ opacity: '0.6' }}>il nostro team ti contatterà per:</span>
          </h3>
          
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <span style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}>•</span>
                <span style={{ color: '#fafafa', fontSize: '14px', lineHeight: '1.6', fontFamily: 'Arial, Helvetica, sans-serif', display: 'block', marginBottom: '8px' }}>Analizzare in dettaglio il tuo progetto</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <span style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}>•</span>
                <span style={{ color: '#fafafa', fontSize: '14px', lineHeight: '1.6', fontFamily: 'Arial, Helvetica, sans-serif', display: 'block', marginBottom: '8px' }}>Definire la strategia migliore</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <span style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}>•</span>
                <span style={{ color: '#fafafa', fontSize: '14px', lineHeight: '1.6', fontFamily: 'Arial, Helvetica, sans-serif', display: 'block', marginBottom: '8px' }}>Prepararti un preventivo personalizzato</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <span style={{ color: '#fafafa', marginRight: '8px', fontSize: '16px', float: 'left' }}>•</span>
                <span style={{ color: '#fafafa', fontSize: '14px', lineHeight: '1.6', fontFamily: 'Arial, Helvetica, sans-serif', display: 'block', marginBottom: '8px' }}>Pianificare i tempi di realizzazione</span>
              </td>
            </tr>
          </table>
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
