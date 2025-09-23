'use client';

import React, { useState } from 'react';
import ContactEmail from '@/components/email/ContactEmail';
import ContactAdminEmail from '@/components/email/ContactAdminEmail';
import BookingClientEmail from '@/components/email/BookingClientEmail';
import BookingAdminEmail from '@/components/email/BookingAdminEmail';

// Dati di esempio per il preview
const sampleContactData = {
  name: 'Mario Rossi',
  email: 'mario.rossi@example.com',
  company: 'Acme Corp',
  phone: '+39 123 456 7890',
  message: 'Siamo interessati ai vostri servizi di web design. Potreste contattarci per una consulenza?',
  services: ['Web Design', 'Digital Marketing'],
  budget: '€5.000 - €10.000',
  timeline: '3-6 mesi'
};

const sampleBookingData = {
  name: 'Giulia Bianchi',
  email: 'giulia.bianchi@example.com',
  company: 'TechStart SRL',
  phone: '+39 987 654 3210',
  service: 'Sviluppo E-commerce',
  date: '2024-02-15',
  time: '14:30',
  message: 'Vorremmo discutere lo sviluppo di una piattaforma e-commerce per la nostra azienda.',
  budget: '€15.000 - €25.000'
};

export default function EmailPreview() {
  const [selectedEmail, setSelectedEmail] = useState('contact-client');

  const emails = {
    'contact-client': {
      title: 'Email Cliente - Richiesta Contatto',
      component: <ContactEmail {...sampleContactData} />
    },
    'contact-admin': {
      title: 'Email Admin - Richiesta Contatto',
      component: <ContactAdminEmail {...sampleContactData} />
    },
    'booking-client': {
      title: 'Email Cliente - Prenotazione',
      component: <BookingClientEmail {...sampleBookingData} />
    },
    'booking-admin': {
      title: 'Email Admin - Prenotazione',
      component: <BookingAdminEmail {...sampleBookingData} />
    }
  };

  return (
    <>
      <style jsx global>{`
        .email-preview-container * {
          all: unset;
          display: block;
        }
        .email-preview-container div {
          display: block;
        }
        .email-preview-container span {
          display: inline;
        }
        .email-preview-container table {
          display: table;
        }
        .email-preview-container tr {
          display: table-row;
        }
        .email-preview-container td {
          display: table-cell;
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Email Preview</h1>
          
          {/* Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Seleziona Email:</label>
            <select 
              value={selectedEmail} 
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {Object.entries(emails).map(([key, email]) => (
                <option key={key} value={key}>{email.title}</option>
              ))}
            </select>
          </div>

          {/* Preview Container */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{emails[selectedEmail as keyof typeof emails].title}</h2>
            
            {/* Email Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <span className="text-sm text-gray-600">Preview Email (come apparirà nella mail)</span>
              </div>
              <div 
                className="email-preview-container"
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: '0',
                  margin: '0',
                  fontFamily: 'Arial, sans-serif',
                  all: 'unset',
                  display: 'block'
                }}
              >
                <div style={{ all: 'unset', display: 'block' }}>
                  {emails[selectedEmail as keyof typeof emails].component}
                </div>
              </div>
            </div>
          </div>

          {/* Sample Data Display */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Dati di Esempio Utilizzati:</h3>
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(selectedEmail.includes('contact') ? sampleContactData : sampleBookingData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}