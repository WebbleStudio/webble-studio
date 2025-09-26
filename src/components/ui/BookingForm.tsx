'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiCall } from '@/hooks/useApiCall';
import { useTranslation } from '@/hooks/useTranslation';
import PhoneInput from './PhoneInput';

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  services: string[];
  customService?: string;
  contactMethod: string;
}

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  services?: string;
  customService?: string;
  contactMethod?: string;
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingForm({ isOpen, onClose }: BookingFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    services: [],
    customService: '',
    contactMethod: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 6;

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        services: [],
        customService: '',
        contactMethod: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const {
    loading: apiLoading,
    error: apiError,
    execute: submitBooking,
  } = useApiCall({
    onSuccess: () => {
      setIsSubmitting(false);
      alert(t('booking.messages.success'));
      onClose();
    },
    onError: () => {
      setIsSubmitting(false);
      alert(t('booking.messages.error'));
    },
  });

  const validateField = (
    field: keyof FormData,
    value: string | string[] | undefined
  ): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || typeof value !== 'string' || !value.trim())
          return t('booking.errors.name_required');
        if (/\d/.test(value)) return t('booking.errors.name_no_numbers');
        return undefined;

      case 'surname':
        if (!value || typeof value !== 'string' || !value.trim())
          return t('booking.errors.surname_required');
        if (/\d/.test(value)) return t('booking.errors.surname_no_numbers');
        return undefined;

      case 'email':
        if (!value || typeof value !== 'string' || !value.trim())
          return t('booking.errors.email_required');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return t('booking.errors.email_invalid');
        return undefined;

      case 'phone':
        if (!value || typeof value !== 'string' || !value.trim())
          return t('booking.errors.phone_required');
        // Validazione semplice: deve contenere almeno 8 caratteri (prefisso + numero)
        if (value.length < 8) return t('booking.errors.phone_invalid');
        return undefined;

      case 'services':
        if (!Array.isArray(value) || value.length === 0)
          return t('booking.errors.services_required');
        return undefined;

      case 'customService':
        if (
          formData.services.includes('altro') &&
          (!value || typeof value !== 'string' || !value.trim())
        ) {
          return t('booking.errors.custom_service_required');
        }
        return undefined;

      case 'contactMethod':
        if (!value || typeof value !== 'string' || !value.trim())
          return t('booking.errors.contact_method_required');
        return undefined;

      default:
        return undefined;
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        newErrors.name = validateField('name', formData.name);
        break;
      case 2:
        newErrors.surname = validateField('surname', formData.surname);
        break;
      case 3:
        newErrors.email = validateField('email', formData.email);
        break;
      case 4:
        newErrors.phone = validateField('phone', formData.phone);
        break;
      case 5:
        newErrors.services = validateField('services', formData.services);
        newErrors.customService = validateField('customService', formData.customService);
        break;
      case 6:
        newErrors.contactMethod = validateField('contactMethod', formData.contactMethod);
        break;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Mappa le traduzioni ai valori del database
  const serviceTranslationMap: Record<string, string> = {
    [t('booking.services.website')]: 'sito web',
    [t('booking.services.advertising')]: 'advertising',
    [t('booking.services.social_media')]: 'social media',
    [t('booking.services.other')]: 'altro',
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const currentServices = [...prev.services];
      const dbServiceValue = serviceTranslationMap[service] || service;
      const serviceIndex = currentServices.indexOf(dbServiceValue);

      if (serviceIndex > -1) {
        // Rimuovi servizio se già selezionato
        currentServices.splice(serviceIndex, 1);
      } else {
        // Aggiungi servizio se non selezionato
        currentServices.push(dbServiceValue);
      }

      return { ...prev, services: currentServices };
    });

    // Clear error when user selects a service
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const handleCustomServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, customService: value }));

    // Clear error when user starts typing
    if (errors.customService) {
      setErrors((prev) => ({ ...prev, customService: undefined }));
    }
  };

  // Mappa le traduzioni dei metodi di contatto ai valori del database
  const contactMethodTranslationMap: Record<string, string> = {
    [t('booking.contact_methods.email')]: 'per email',
    [t('booking.contact_methods.phone')]: 'per telefono',
    [t('booking.contact_methods.meeting')]: 'meet/zoom',
  };

  const handleContactMethodToggle = (method: string) => {
    const dbMethodValue = contactMethodTranslationMap[method] || method;
    handleInputChange('contactMethod', dbMethodValue);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);

      // Invia i dati all'API
      await submitBooking(() =>
        fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t('booking.steps.name');
      case 2:
        return t('booking.steps.surname');
      case 3:
        return t('booking.steps.email');
      case 4:
        return t('booking.steps.phone');
      case 5:
        return t('booking.steps.services');
      case 6:
        return t('booking.steps.contact');
      default:
        return '';
    }
  };

  // Gestione tasti della tastiera
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (currentStep === totalSteps) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Blocca lo scroll
      document.body.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Ripristina lo scroll
      document.body.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, currentStep, totalSteps, handleNext, handleSubmit]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-lg"
      style={{ willChange: 'opacity' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full h-full flex flex-col items-center justify-center px-4 relative"
        style={{ willChange: 'transform, opacity' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Fixed Position */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-10 text-white/60 hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>

        {/* Form Content */}
        <div className="w-full max-w-4xl mx-auto text-left">
          <div className="w-full max-w-4xl flex items-end justify-between">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {currentStep === 1 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.name')}
                        </h2>
                        {errors.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.name}
                          </motion.div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('booking.placeholders.name')}
                        className={`w-full text-2xl md:text-3xl bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ${
                          errors.name ? 'border-b border-red-500' : ''
                        }`}
                        autoFocus
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.surname')}
                        </h2>
                        {errors.surname && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.surname}
                          </motion.div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        placeholder={t('booking.placeholders.surname')}
                        className={`w-full text-2xl md:text-3xl bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ${
                          errors.surname ? 'border-b border-red-500' : ''
                        }`}
                        autoFocus
                      />
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.email')}
                        </h2>
                        {errors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.email}
                          </motion.div>
                        )}
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('booking.placeholders.email')}
                        className={`w-full text-2xl md:text-3xl bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ${
                          errors.email ? 'border-b border-red-500' : ''
                        }`}
                        autoFocus
                      />
                    </>
                  )}

                  {currentStep === 4 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.phone')}
                        </h2>
                        {errors.phone && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.phone}
                          </motion.div>
                        )}
                      </div>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value)}
                        placeholder={t('booking.placeholders.phone')}
                        error={!!errors.phone}
                        autoFocus
                      />
                    </>
                  )}

                  {currentStep === 5 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.services')}
                        </h2>
                        {errors.services && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.services}
                          </motion.div>
                        )}
                      </div>
                      <motion.div
                        key={`placeholder-${currentStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-white/60 text-2xl md:text-3xl"
                      >
                        {t('booking.placeholders.services_question')}
                      </motion.div>
                    </>
                  )}

                  {currentStep === 6 && (
                    <>
                      <div className="relative">
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-12">
                          {t('booking.steps.contact')}
                        </h2>
                        {errors.contactMethod && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-8 left-0 text-red-400 text-sm"
                          >
                            {errors.contactMethod}
                          </motion.div>
                        )}
                      </div>
                      <div className="text-white/60 text-2xl md:text-3xl">
                        {t('booking.placeholders.contact_question')}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Fixed Position */}
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-12 h-12 text-white hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                disabled={isSubmitting || apiLoading}
                className="flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#F30D52' }}
              >
                {isSubmitting || apiLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : currentStep === totalSteps ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar - Global */}
        <div className="w-full max-w-4xl mx-auto bg-gray-800 h-1 rounded-full overflow-hidden mb-8 mt-4">
          <motion.div
            className="h-full"
            style={{ backgroundColor: '#F30D52' }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>

        {/* Selection Buttons - Absolute Position Below Progress Bar */}
        {currentStep === 5 && (
          <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[70px] w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                t('booking.services.website'),
                t('booking.services.advertising'),
                t('booking.services.social_media'),
                t('booking.services.other'),
              ].map((service, index) => (
                <motion.button
                  key={service}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                  onClick={() => handleServiceToggle(service)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleServiceToggle(service);
                    }
                  }}
                  className={`px-6 py-4 rounded-full font-medium transition-all duration-200 backdrop-blur-sm cursor-pointer ${
                    formData.services.includes(serviceTranslationMap[service])
                      ? 'bg-[rgba(250,250,250,0.5)] text-white hover:bg-[rgba(250,250,250,0.7)] active:bg-[rgba(250,250,250,0.7)]'
                      : 'bg-[rgba(250,250,250,0.3)] text-white hover:bg-[rgba(250,250,250,0.5)] active:bg-[rgba(250,250,250,0.5)]'
                  }`}
                  style={{
                    border: formData.services.includes(serviceTranslationMap[service])
                      ? '0.5px solid rgba(250, 250, 250, 0.8)'
                      : '0.5px solid rgba(250, 250, 250, 0.3)',
                  }}
                  tabIndex={0}
                >
                  {service}
                </motion.button>
              ))}
            </div>

            {/* Custom Service Input */}
            {formData.services.includes('altro') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={formData.customService}
                    onChange={(e) => handleCustomServiceChange(e.target.value)}
                    placeholder={t('booking.services.custom_placeholder')}
                    className={`w-full text-lg bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ${
                      errors.customService ? 'border-b border-red-500' : ''
                    }`}
                    style={{
                      borderBottom: errors.customService
                        ? '1px solid #ef4444'
                        : '1px solid rgba(250, 250, 250, 0.3)',
                    }}
                    autoFocus
                  />
                  {errors.customService && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-8 left-0 text-red-400 text-sm"
                    >
                      {errors.customService}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {currentStep === 6 && (
          <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[70px] w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                t('booking.contact_methods.email'),
                t('booking.contact_methods.phone'),
                t('booking.contact_methods.meeting'),
              ].map((method, index) => (
                <motion.button
                  key={method}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                  onClick={() => handleContactMethodToggle(method)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleContactMethodToggle(method);
                      // Auto-avanza dopo la selezione
                      setTimeout(() => handleNext(), 100);
                    }
                  }}
                  className={`px-6 py-4 rounded-full font-medium transition-all duration-200 backdrop-blur-sm cursor-pointer ${
                    formData.contactMethod === contactMethodTranslationMap[method]
                      ? 'bg-[rgba(250,250,250,0.5)] text-white hover:bg-[rgba(250,250,250,0.7)] active:bg-[rgba(250,250,250,0.7)]'
                      : 'bg-[rgba(250,250,250,0.3)] text-white hover:bg-[rgba(250,250,250,0.5)] active:bg-[rgba(250,250,250,0.5)]'
                  }`}
                  style={{
                    border: '0.5px solid rgba(250, 250, 250, 0.3)',
                  }}
                  tabIndex={0}
                >
                  {method}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
