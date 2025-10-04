import React from 'react';

interface BookingAdminEmailProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  service: string;
  services?: string[];
  contactMethod: string;
  date?: string;
}

export default function BookingAdminEmail({
  name,
  surname,
  email,
  phone,
  service,
  services,
  contactMethod,
  date,
}: BookingAdminEmailProps) {
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
      <div style={{ display: 'none', fontSize: '0', lineHeight: '0', maxHeight: '0', overflow: 'hidden' }}>
        Servizio di {service} per {name} {surname}
      </div>

      {/* Top Color Strip */}
      <div
        style={{
          width: '100%',
          height: '7px',
          backgroundColor: '#EF2D56',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      />

      {/* Header Section */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#050505',
          padding: '40px 20px 30px 20px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              color: '#fafafa',
              fontSize: '28px',
              fontWeight: 'normal',
              margin: '0 0 10px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal' }}>Richiesta da </span>
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>{name}</span>
          </h1>
          
          <p
            style={{
              color: '#fafafa',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: '0 auto',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 'normal',
              textAlign: 'center',
              width: '100%',
              maxWidth: '390px',
            }}
          >
            <span style={{ opacity: '0.6' }}>Un cliente ha richiesto un appuntamento <br /> per il servizio </span><strong style={{ opacity: '1', color: '#fafafa' }}>
              {(() => {
                if (services && services.length > 1) {
                  const firstService = services[0];
                  const additionalCount = services.length - 1;
                  const formattedFirstService = 
                    firstService?.toLowerCase() === 'sito web' && 'Sito Web'
                    || firstService?.toLowerCase() === 'advertising' && 'Advertising'
                    || firstService?.toLowerCase() === 'social media' && 'Social Media'
                    || firstService?.toLowerCase() === 'altro' && 'Altro'
                    || firstService;
                  return `${formattedFirstService} (+${additionalCount})`;
                } else {
                  return service?.toLowerCase() === 'sito web' && 'Sito Web'
                    || service?.toLowerCase() === 'advertising' && 'Advertising'
                    || service?.toLowerCase() === 'social media' && 'Social Media'
                    || service?.toLowerCase() === 'altro' && 'Altro'
                    || service;
                }
              })()}
            </strong>
          </p>
        </div>
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
              fontWeight: '500',
              margin: '0 0 20px 0',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textAlign: 'center',
            }}
          >
            Dettagli richiesta:
          </h2>

          {/* Nome e Cognome - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {name} {surname}
            </h3>
          </div>

          {/* Email - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {email}
            </h3>
          </div>

          {/* Telefono - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {phone}
            </h3>
          </div>

          {/* Metodo Contatto - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {contactMethod?.toLowerCase() === 'per email' ? 'Contatto via mail' :
               contactMethod?.toLowerCase() === 'per telefono' ? 'Contatto telefonico' :
               contactMethod?.toLowerCase() === 'meet/zoom' ? 'Chiamata Meet/Zoom' :
               contactMethod?.toLowerCase() === 'email' ? 'Contatto via mail' :
               contactMethod?.toLowerCase() === 'phone' ? 'Contatto telefonico' :
               contactMethod?.toLowerCase() === 'meet' ? 'Chiamata Meet/Zoom' :
               contactMethod?.toLowerCase() === 'telefono' ? 'Contatto telefonico' :
               contactMethod?.toLowerCase() === 'chiamata' ? 'Chiamata Meet/Zoom' :
               'Contatto via mail'}
            </h3>
          </div>

          {/* Servizio - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {(() => {
                if (services && services.length > 1) {
                  const firstService = services[0];
                  const additionalCount = services.length - 1;
                  const formattedFirstService = 
                    firstService?.toLowerCase() === 'sito web' && 'Sito Web'
                    || firstService?.toLowerCase() === 'advertising' && 'Advertising'
                    || firstService?.toLowerCase() === 'social media' && 'Social Media'
                    || firstService?.toLowerCase() === 'altro' && 'Altro'
                    || firstService;
                  return `${formattedFirstService} (+${additionalCount})`;
                } else {
                  return service?.toLowerCase() === 'sito web' && 'Sito Web'
                    || service?.toLowerCase() === 'advertising' && 'Advertising'
                    || service?.toLowerCase() === 'social media' && 'Social Media'
                    || service?.toLowerCase() === 'altro' && 'Altro'
                    || service;
                }
              })()}
            </h3>
          </div>

          {/* Data - 100% width */}
          <div
            style={{
              width: '100%',
              height: '53px',
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
              {date || new Date().toLocaleDateString('it-IT')}
            </h3>
          </div>
        </div>

        {/* Dashboard Button Section */}
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(250, 250, 250, 0.20)',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            margin: '20px auto 0 auto',
            boxSizing: 'border-box',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          {/* Contact Buttons */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <tr>
              <td style={{ width: '50%', padding: '0 5px 0 0' }}>
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: 'block',
                    backgroundColor: 'transparent',
                    color: '#fafafa',
                    padding: '12px 20px',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid #ffffff',
                    textTransform: 'uppercase',
                  }}
                >
                  CONTATTA
                </a>
              </td>
              <td style={{ width: '50%', padding: '0 0 0 5px' }}>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  style={{
                    display: 'block',
                    backgroundColor: 'transparent',
                    color: '#fafafa',
                    padding: '12px 20px',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid #ffffff',
                    textTransform: 'uppercase',
                  }}
                >
                  CHIAMA
                </a>
              </td>
            </tr>
          </table>
          
          <a
            href="https://webblestudio.com/admin"
            style={{
              display: 'block',
              backgroundColor: '#EF2D56',
              color: '#ffffff',
              padding: '15px 30px',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 'normal',
              fontSize: '16px',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontWeight: 'normal' }}>Vai alla </span><span style={{ fontWeight: 'bold' }}>Dashboard</span>
          </a>
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
            Sistema di notifica automatica
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
            © 2025 Webble Studio
          </p>
        </div>
      </div>

    </div>
  );
}
