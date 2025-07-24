'use client';

import React, { useState } from 'react';
import { useApiCall } from '@/hooks/useApiCall';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';

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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyConsent: false,
    marketingConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    loading: isSubmitting,
    error: apiError,
    execute: submitForm,
  } = useApiCall({
    onSuccess: () => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        privacyConsent: false,
        marketingConsent: false,
      });
      setErrors({});
      setShowSuccessMessage(true);
      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => setShowSuccessMessage(false), 5000);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'phone' && typeof newValue === 'string') {
      newValue = newValue.replace(/[^0-9\s\+\-\(\)]/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Nascondi il messaggio di successo quando l'utente inizia a digitare
    if (showSuccessMessage) {
      setShowSuccessMessage(false);
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
      await submitForm(() =>
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      );
    }
  };

  return (
    <section className="h-auto w-full flex items-center justify-center py-20">
      <div className="w-full">
        <h2 className="text-[50px] md:text-[50px] lg:text-[60px] font-figtree font-regular text-text-primary text-left">
          <AnimatedText>{t('contact.title')}</AnimatedText>
        </h2>

        {showSuccessMessage && (
          <AnimatedText as="p" className="text-green-500 text-sm font-medium mb-12">
            {t('contact.success')}
          </AnimatedText>
        )}

        {apiError && (
          <AnimatedText as="p" className="text-red-400 text-sm font-medium mb-12">
            {apiError}
          </AnimatedText>
        )}

        <form onSubmit={handleSubmit} className="space-y-12 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label
                htmlFor="name"
                className="block text-[20px] font-figtree font-regular text-text-primary mb-3 text-left"
              >
                <AnimatedText>{t('contact.fields.name')}</AnimatedText>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('contact.fields.name_placeholder')}
                className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-line-fixed focus:border-line-fixed-focus'
                }`}
              />
              {errors.name && (
                <AnimatedText as="p" className="text-red-400 text-sm mt-2 font-medium">
                  {t('contact.errors.name')}
                </AnimatedText>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[20px] font-figtree font-regular text-text-primary mb-3 text-left"
              >
                <AnimatedText>{t('contact.fields.email')}</AnimatedText>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('contact.fields.email_placeholder')}
                className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-line-fixed focus:border-line-fixed-focus'
                }`}
              />
              {errors.email && (
                <AnimatedText as="p" className="text-red-400 text-sm mt-2 font-medium">
                  {errors.email === "Inserisci un'email valida"
                    ? t('contact.errors.email_invalid')
                    : t('contact.errors.email')}
                </AnimatedText>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-[20px] font-figtree font-regular text-text-primary mb-3 text-left"
            >
              <AnimatedText>{t('contact.fields.phone')}</AnimatedText>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('contact.fields.phone_placeholder')}
              className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base ${
                errors.phone
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-line-fixed focus:border-line-fixed-focus'
              }`}
            />
            {errors.phone && (
              <AnimatedText as="p" className="text-red-400 text-sm mt-2 font-medium">
                {t('contact.errors.phone')}
              </AnimatedText>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-[20px] font-figtree font-regular text-text-primary mb-3 text-left"
            >
              <AnimatedText>{t('contact.fields.message')}</AnimatedText>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder={t('contact.fields.message_placeholder')}
              className={`w-full px-0 py-3 border-b bg-transparent text-second placeholder-main/50 focus:outline-none transition-colors text-base resize-none ${
                errors.message
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-line-fixed focus:border-line-fixed-focus'
              }`}
            />
            {errors.message && (
              <AnimatedText as="p" className="text-red-400 text-sm mt-2 font-medium">
                {t('contact.errors.message')}
              </AnimatedText>
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
                <label
                  htmlFor="privacyConsent"
                  className="text-sm text-text-primary leading-relaxed"
                >
                  <AnimatedText>{t('contact.privacy')}</AnimatedText>
                </label>
              </div>
              {errors.privacyConsent && (
                <AnimatedText as="p" className="text-red-400 text-sm mt-2 font-medium ml-7">
                  {t('contact.errors.privacy')}
                </AnimatedText>
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
                <label
                  htmlFor="marketingConsent"
                  className="text-sm text-text-primary leading-relaxed"
                >
                  <AnimatedText>{t('contact.marketing')}</AnimatedText>
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
                : 'bg-bg-secondary text-text-inverse hover:hover-bg-secondary'
            }`}
          >
            <AnimatedText>
              {isSubmitting ? t('contact.submitting') : t('contact.submit')}
            </AnimatedText>
          </button>
        </form>
      </div>
    </section>
  );
}
