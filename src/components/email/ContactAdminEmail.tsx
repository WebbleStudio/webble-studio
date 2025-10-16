import React from 'react';

interface ContactAdminEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactAdminEmail({ name, email, phone, message }: ContactAdminEmailProps) {
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
        Nuovo messaggio di contatto da {name}
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
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal' }}>
              Messaggio da{' '}
            </span>
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
              {name}
            </span>
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
            <span style={{ opacity: '0.6' }}>
              Un cliente ha inviato un messaggio tramite <br /> il{' '}
            </span>
            <strong style={{ opacity: '1', color: '#fafafa' }}>form di contatto</strong>
          </p>
        </div>
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
            Informazioni cliente:
          </h2>

          {/* Nome - 100% width */}
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
              {name}
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
        </div>

        {/* Message Container */}
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
            Messaggio:
          </h2>

          {/* Message text container */}
          <div
            style={{
              width: '100%',
              minHeight: '100px',
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
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons Section */}
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
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '0 5px 0 0' }}>
                  <a
                    href={`mailto:${email}?subject=Re: Il tuo progetto ci interessa&body=Ciao ${name},%0D%0A%0D%0AGrazie per averci contattato!%0D%0A%0D%0A`}
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
            </tbody>
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
            <span style={{ fontWeight: 'normal' }}>Vai alla </span>
            <span style={{ fontWeight: 'bold' }}>Dashboard</span>
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
