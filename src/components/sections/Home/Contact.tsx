'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  privacyConsent?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyConsent: false,
    marketingConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    // Filtra il campo telefono per consentire solo numeri, spazi, +, -, (, )
    if (name === 'phone' && typeof newValue === 'string') {
      newValue = newValue.replace(/[^0-9\s\+\-\(\)]/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Reset status messaggi
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Inserisci un'email valida";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Il telefono è obbligatorio';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è obbligatorio';
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Devi accettare il trattamento dei dati';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
            privacyConsent: false,
            marketingConsent: false,
          });
          setErrors({});
          setSubmitStatus('success');
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="h-auto w-full flex items-center justify-center">
      <div className="w-full">
        <h2 className="text-[50px] md:text-[50px] lg:text-[60px] font-figtree font-regular text-second mb-12 text-left">
          Contattaci
        </h2>

        {/* Messaggi di stato */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ Messaggio inviato con successo! Ti contatteremo presto.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ❌ Si è verificato un errore. Riprova o contattaci direttamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label
                htmlFor="name"
                className="block text-[20px] font-figtree font-regular text-second mb-3 text-left"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Mario Rossi"
                className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-main/20 focus:border-main/40'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[20px] font-figtree font-regular text-second mb-3 text-left"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.com"
                className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-main/20 focus:border-main/40'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-[20px] font-figtree font-regular text-second mb-3 text-left"
            >
              Telefono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+39 123 456 7890"
              className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                errors.phone
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-main/20 focus:border-main/40'
              }`}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-[20px] font-figtree font-regular text-second mb-3 text-left"
            >
              Parlaci del tuo progetto
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder="Scrivi qui"
              className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base resize-none ${
                errors.message
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-main/20 focus:border-main/40'
              }`}
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.message}</p>
            )}
          </div>

          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-start lg:gap-8">
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleInputChange}
                  className={`mt-1 w-4 h-4 text-main bg-transparent rounded focus:ring-2 ${
                    errors.privacyConsent
                      ? 'border-red-400 focus:ring-red-400/40'
                      : 'border-main/20 focus:ring-main/40'
                  }`}
                />
                <label htmlFor="privacyConsent" className="text-sm text-second leading-relaxed">
                  Acconsento al trattamento dei dati personali ai sensi del GDPR
                </label>
              </div>
              {errors.privacyConsent && (
                <p className="text-red-400 text-sm mt-2 font-medium ml-7">
                  {errors.privacyConsent}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-main bg-transparent border-main/20 rounded focus:ring-main/40 focus:ring-2"
                />
                <label htmlFor="marketingConsent" className="text-sm text-second leading-relaxed">
                  Accetto di ricevere promozioni e comunicazioni marketing
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-4 font-medium rounded-lg transition-colors mt-8 ${
              isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-second text-main hover:bg-second/90'
            }`}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
          </button>
        </form>
      </div>
    </section>
  );
}
