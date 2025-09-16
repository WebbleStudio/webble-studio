'use client';

import React, { useEffect, useState } from 'react';
import { useBookings, Booking } from '@/hooks/useBookings';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface BookingManagerProps {
  className?: string;
}

export default function BookingManager({ className = '' }: BookingManagerProps) {
  const { t } = useTranslation();
  const { bookings, loading, error, fetchBookings, deleteBookings } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((booking) => booking.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookings.length === 0) return;

    const success = await deleteBookings(selectedBookings);
    if (success) {
      setSelectedBookings([]);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getServiceColor = (service: string) => {
    const colors = {
      'sito web': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      advertising: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'social media': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      altro: 'bg-[#F20352]/20 text-[#F20352] dark:bg-[#F20352]/30 dark:text-[#F20352]/80',
    };
    return (
      colors[service.toLowerCase() as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    );
  };

  const getContactMethodIcon = (method: string) => {
    const icons = {
      'per email': 'email',
      'per telefono': 'phone',
      'meet/zoom': 'video',
    };
    return icons[method.toLowerCase() as keyof typeof icons] || 'phone';
  };

  const ServiceTag = ({
    service,
    customService,
    bookingId,
  }: {
    service: string;
    customService?: string;
    bookingId: string;
  }) => {
    if (service === 'altro' && customService) {
      return (
        <div className="relative inline-block">
          <button
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(service)} cursor-pointer hover:opacity-80 transition-opacity`}
            onMouseEnter={() => setHoveredService(bookingId)}
            onMouseLeave={() => setHoveredService(null)}
          >
            {service}
          </button>
          {hoveredService === bookingId && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
              {customService}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(service)}`}
      >
        {service}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352]"></div>
        <span className="ml-3 text-text-primary-60">{t('admin.booking_manager.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
      >
        <p className="text-red-700 dark:text-red-200 text-center">
          {t('admin.booking_manager.error')}: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-text-primary">
            {t('admin.booking_manager.title')}
          </h2>
          {selectedBookings.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-primary-60">
                {selectedBookings.length} {t('admin.booking_manager.selected_count')}
              </span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                {t('admin.booking_manager.delete')}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-[#F20352] text-white rounded-lg hover:bg-[#F20352]/90 transition-colors"
        >
          {t('admin.booking_manager.refresh')}
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-primary-60 text-lg">{t('admin.booking_manager.no_bookings')}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-neutral-900 rounded-lg border border-border-primary-20 overflow-hidden">
            {/* Header tabella */}
            <div className="bg-gray-50 dark:bg-neutral-900/50 px-6 py-4 border-b border-border-primary-20">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-text-primary-60">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === bookings.length && bookings.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#F20352] bg-gray-100 border-gray-300 rounded focus:ring-[#F20352] focus:ring-2"
                  />
                </div>
                <div className="col-span-2">{t('admin.booking_manager.table.client')}</div>
                <div className="col-span-2">{t('admin.booking_manager.table.service')}</div>
                <div className="col-span-2">{t('admin.booking_manager.table.contact')}</div>
                <div className="col-span-2">{t('admin.booking_manager.table.method')}</div>
                <div className="col-span-2">{t('admin.booking_manager.table.date')}</div>
                <div className="col-span-1 text-center">
                  {t('admin.booking_manager.table.actions')}
                </div>
              </div>
            </div>

            {/* Righe tabella */}
            <div className="divide-y divide-border-primary-20">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-neutral-900/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Checkbox */}
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => handleSelectBooking(booking.id)}
                        className="w-4 h-4 text-[#F20352] bg-gray-100 border-gray-300 rounded focus:ring-[#F20352] focus:ring-2"
                      />
                    </div>
                    {/* Cliente */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F20352]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#F20352] font-semibold text-sm">
                            {booking.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">
                            {booking.name} {booking.surname}
                          </p>
                          <p className="text-text-primary-60 text-xs">{booking.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Servizi */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {/* Nuovo formato con array */}
                        {booking.services && booking.services.length > 0 ? (
                          <>
                            {booking.services.map((service, index) => (
                              <ServiceTag
                                key={index}
                                service={service}
                                customService={booking.custom_service}
                                bookingId={booking.id}
                              />
                            ))}
                          </>
                        ) : (
                          /* Fallback per formato legacy */
                          booking.service && (
                            <ServiceTag
                              service={booking.service}
                              customService={booking.custom_service}
                              bookingId={booking.id}
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* Contatto */}
                    <div className="col-span-2">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${booking.email}`}
                          className="text-[#F20352] dark:text-[#E91E63] hover:underline text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Email
                        </a>
                        <a
                          href={`tel:${booking.phone}`}
                          className="text-[#F20352] hover:underline text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {booking.phone}
                        </a>
                      </div>
                    </div>

                    {/* Metodo */}
                    <div className="col-span-2">
                      <p className="flex items-center gap-2 text-sm text-text-primary">
                        {getContactMethodIcon(booking.contact_method) === 'email' && (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        {getContactMethodIcon(booking.contact_method) === 'phone' && (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        )}
                        {getContactMethodIcon(booking.contact_method) === 'video' && (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        {booking.contact_method}
                      </p>
                    </div>

                    {/* Data */}
                    <div className="col-span-2">
                      <p className="text-sm text-text-primary">
                        {new Date(booking.created_at).toLocaleDateString('it-IT')}
                      </p>
                      <p className="text-xs text-text-primary-60">
                        {new Date(booking.created_at).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Azioni */}
                    <div className="col-span-1 flex justify-center">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          title="Dettagli"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <a
                          href={`mailto:${booking.email}?subject=Re: Richiesta servizio ${booking.service}&body=Ciao ${booking.name},%0D%0A%0D%0AGrazie per aver scelto Webble Studio!%0D%0A%0D%0A`}
                          className="p-2 text-[#F20352] hover:text-[#F20352]/80 hover:bg-[#F20352]/10 rounded transition-colors"
                          title="Rispondi"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-lg border border-border-primary-20 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F20352]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#F20352] font-semibold">
                        {booking.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {booking.name} {booking.surname}
                      </p>
                      <p className="text-text-primary-60 text-sm">{booking.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {/* Nuovo formato con array */}
                    {booking.services && booking.services.length > 0 ? (
                      <>
                        {booking.services.map((service, index) => (
                          <ServiceTag
                            key={index}
                            service={service}
                            customService={booking.custom_service}
                            bookingId={booking.id}
                          />
                        ))}
                      </>
                    ) : (
                      /* Fallback per formato legacy */
                      booking.service && (
                        <ServiceTag
                          service={booking.service}
                          customService={booking.custom_service}
                          bookingId={booking.id}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-text-primary-60 text-xs mb-1">Telefono</p>
                    <a href={`tel:${booking.phone}`} className="text-[#F20352] hover:underline">
                      {booking.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-text-primary-60 text-xs mb-1">Metodo</p>
                    <p className="flex items-center gap-2">
                      {getContactMethodIcon(booking.contact_method) === 'email' && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {getContactMethodIcon(booking.contact_method) === 'phone' && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                      {getContactMethodIcon(booking.contact_method) === 'video' && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {booking.contact_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-text-primary-60 text-sm">
                    {new Date(booking.created_at).toLocaleDateString('it-IT')} •{' '}
                    {new Date(booking.created_at).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <a
                      href={`mailto:${booking.email}?subject=Re: Richiesta servizio ${booking.service}&body=Ciao ${booking.name},%0D%0A%0D%0AGrazie per aver scelto Webble Studio!%0D%0A%0D%0A`}
                      className="px-3 py-2 text-sm bg-[#F20352] text-white rounded hover:bg-[#F20352]/90 transition-colors"
                    >
                      Rispondi
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Modal dettagli */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">
                  {t('admin.booking_manager.details.title')}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    {t('admin.booking_manager.details.client_info')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.name')}
                      </p>
                      <p className="text-text-primary">
                        {selectedBooking.name} {selectedBooking.surname}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.email')}
                      </p>
                      <a
                        href={`mailto:${selectedBooking.email}`}
                        className="text-[#F20352] hover:underline"
                      >
                        {selectedBooking.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.phone')}
                      </p>
                      <a
                        href={`tel:${selectedBooking.phone}`}
                        className="text-[#F20352] hover:underline"
                      >
                        {selectedBooking.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.request_date')}
                      </p>
                      <p className="text-text-primary">{formatDate(selectedBooking.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    {t('admin.booking_manager.details.request_details')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.services_requested')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {/* Nuovo formato con array */}
                        {selectedBooking.services && selectedBooking.services.length > 0 ? (
                          <>
                            {selectedBooking.services.map((service, index) => (
                              <ServiceTag
                                key={index}
                                service={service}
                                customService={selectedBooking.custom_service}
                                bookingId={selectedBooking.id}
                              />
                            ))}
                          </>
                        ) : (
                          /* Fallback per formato legacy */
                          selectedBooking.service && (
                            <ServiceTag
                              service={selectedBooking.service}
                              customService={selectedBooking.custom_service}
                              bookingId={selectedBooking.id}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-text-primary-60 text-sm">
                        {t('admin.booking_manager.details.preferred_contact')}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>{getContactMethodIcon(selectedBooking.contact_method)}</span>
                        {selectedBooking.contact_method}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedBooking.email}?subject=Re: Richiesta servizio ${selectedBooking.service}&body=Ciao ${selectedBooking.name},%0D%0A%0D%0AGrazie per aver scelto Webble Studio!%0D%0A%0D%0A`}
                    className="flex-1 px-4 py-2 bg-[#F20352] text-white rounded-lg hover:bg-[#F20352]/90 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {t('admin.booking_manager.details.reply_email')}
                  </a>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="flex-1 px-4 py-2 bg-[#F20352]/80 text-white rounded-lg hover:bg-[#F20352] transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {t('admin.booking_manager.details.call')}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal conferma eliminazione */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-text-primary mb-4">
                {t('admin.booking_manager.delete_confirm.title')}
              </h3>
              <p className="text-text-primary-60 mb-6">
                {t('admin.booking_manager.delete_confirm.message').replace(
                  '{count}',
                  selectedBookings.length.toString()
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  {t('admin.booking_manager.delete_confirm.cancel')}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('admin.booking_manager.delete_confirm.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
