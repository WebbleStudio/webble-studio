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
  message:
    'Siamo interessati ai vostri servizi di web design. Potreste contattarci per una consulenza?',
  services: ['Web Design', 'Digital Marketing'],
  budget: '€5.000 - €10.000',
  timeline: '3-6 mesi',
};

const sampleBookingData = {
  name: 'Giulia',
  surname: 'Bianchi',
  email: 'giulia.bianchi@example.com',
  phone: '+39 987 654 3210',
  service: 'Sito Web',
  contactMethod: 'email',
  date: '23/09/2025',
};

export default function EmailPreview() {
  const [selectedEmail, setSelectedEmail] = useState('contact-client');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

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
          
          {/* Selectors */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Seleziona Email:</label>
              <select 
                value={selectedEmail} 
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                {Object.entries(emails).map(([key, email]) => (
                  <option key={key} value={key}>{email.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Modalità Visualizzazione:</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'desktop'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🖥️ Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'mobile'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📱 Mobile
                </button>
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {emails[selectedEmail as keyof typeof emails].title} - {viewMode === 'desktop' ? 'Desktop' : 'Mobile'}
            </h2>
            
            {/* Email Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Preview Email (come apparirà nella mail)
                </span>
                <span className="text-xs text-gray-500">
                  {viewMode === 'desktop' ? '🖥️ Desktop View' : '📱 Mobile View'}
                </span>
              </div>
              
              {/* Responsive Container */}
              <div 
                className={`${
                  viewMode === 'mobile' 
                    ? 'max-w-sm mx-auto' 
                    : 'w-full'
                } transition-all duration-300`}
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: viewMode === 'mobile' ? '10px' : '0',
                  margin: '0',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                <div 
                  className="email-preview-container"
                  style={{
                    backgroundColor: '#f4f4f4',
                    padding: '0',
                    margin: '0',
                    fontFamily: 'Arial, sans-serif',
                    all: 'unset',
                    display: 'block',
                    maxWidth: viewMode === 'mobile' ? '375px' : '100%',
                    width: '100%',
                  }}
                >
                  <div style={{ all: 'unset', display: 'block' }}>
                    {emails[selectedEmail as keyof typeof emails].component}
                  </div>
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