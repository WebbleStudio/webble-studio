'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useTranslation } from '@/hooks';

export default function Team() {
  const { t } = useTranslation();
  const [openQuote, setOpenQuote] = useState<string | null>(null);

  const toggleQuote = (memberId: string) => {
    setOpenQuote(openQuote === memberId ? null : memberId);
  };

  return (
    <section className="w-full pt-[50px]">
      <div className="w-full max-w-[1370px] mx-auto md:py-[40px] lg:px-[100px] xl:px-[150px] xl:py-[75px]">
        {/* Team cards container */}
        {/* Mobile: Grid layout */}
        <div className="bg-[#0b0b0b] rounded-[32px] border border-[#f4f4f4]/10 p-3 md:hidden">
          <div className="grid grid-cols-1 gap-6">
            {/* Card 1 - Matais */}
            <div
              className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
              onClick={() => toggleQuote('matias')}
            >
              <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                  <OptimizedImage
                    src="/img/matias.jpg"
                    alt="Matias"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Quote Panel */}
                <AnimatePresence>
                  {openQuote === 'matias' && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-2 text-white/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                        <p className="text-white text-sm leading-relaxed italic">
                          {t('team.matias.quote')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-4 bg-[#121212]">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-medium">
                      {t('team.matias.name')}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">{t('team.matias.role')}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <img
                      src="/icons/diagonal-arrow.svg"
                      alt=""
                      className={`w-3 h-3 opacity-60 transition-transform duration-300 ${openQuote === 'matias' ? 'rotate-45' : ''} group-hover:rotate-45`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 - Victor */}
            <div
              className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
              onClick={() => toggleQuote('victor')}
            >
              <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                  <OptimizedImage
                    src="/img/victor.jpg"
                    alt="Victor"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Quote Panel */}
                <AnimatePresence>
                  {openQuote === 'victor' && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-2 text-white/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                        <p className="text-white text-sm leading-relaxed italic">
                          {t('team.victor.quote')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-4 bg-[#121212]">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-medium">
                      {t('team.victor.name')}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">{t('team.victor.role')}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <img
                      src="/icons/diagonal-arrow.svg"
                      alt=""
                      className={`w-3 h-3 opacity-60 transition-transform duration-300 ${openQuote === 'victor' ? 'rotate-45' : ''} group-hover:rotate-45`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 - Anselmo */}
            <div
              className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
              onClick={() => toggleQuote('anselmo')}
            >
              <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                  <OptimizedImage
                    src="/img/nome.jpg"
                    alt="Nome"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Quote Panel */}
                <AnimatePresence>
                  {openQuote === 'anselmo' && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-2 text-white/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                        <p className="text-white text-sm leading-relaxed italic">
                          {t('team.anselmo.quote')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-4 bg-[#121212]">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-medium">
                      {t('team.anselmo.name')}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">{t('team.anselmo.role')}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <img
                      src="/icons/diagonal-arrow.svg"
                      alt=""
                      className={`w-3 h-3 opacity-60 transition-transform duration-300 ${openQuote === 'anselmo' ? 'rotate-45' : ''} group-hover:rotate-45`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4 - Imane */}
            <div
              className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
              onClick={() => toggleQuote('imane')}
            >
              <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                  <OptimizedImage
                    src="/img/imane.jpg"
                    alt="Imane"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Quote Panel */}
                <AnimatePresence>
                  {openQuote === 'imane' && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-2 text-white/40"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                        <p className="text-white text-sm leading-relaxed italic">
                          {t('team.imane.quote')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-4 bg-[#121212]">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-medium">
                      {t('team.imane.name')}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">{t('team.imane.role')}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                    <img
                      src="/icons/diagonal-arrow.svg"
                      alt=""
                      className={`w-3 h-3 opacity-60 transition-transform duration-300 ${openQuote === 'imane' ? 'rotate-45' : ''} group-hover:rotate-45`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Two black containers with shift */}
        <div className="hidden md:flex gap-0 items-start">
          {/* Left container - Matais & Gabriele */}
          <div className="flex-1 bg-[#0b0b0b] rounded-tl-[32px] rounded-tr-[32px] rounded-bl-[32px] p-3 max-w-[600px]">
            <div className="grid grid-cols-1 gap-3">
              {/* Card 1 - Matais */}
              <div
                className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
                onClick={() => toggleQuote('matias-desktop')}
              >
                <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                    <OptimizedImage
                      src="/img/matias.jpg"
                      alt="Matias"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  {/* Quote Panel */}
                  <AnimatePresence>
                    {openQuote === 'matias-desktop' && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                      >
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-white/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                          </svg>
                          <p className="text-white text-sm leading-relaxed italic">
                            {t('team.matias.quote')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">
                        {t('team.matias.name')}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">{t('team.matias.role')}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <img
                        src="/icons/diagonal-arrow.svg"
                        alt=""
                        className={`w-4 h-4 transition-transform duration-300 ${openQuote === 'matias-desktop' ? 'rotate-45' : ''} group-hover:rotate-45`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 - Victor */}
              <div
                className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
                onClick={() => toggleQuote('victor-desktop')}
              >
                <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                    <OptimizedImage
                      src="/img/victor.jpg"
                      alt="Victor"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  {/* Quote Panel */}
                  <AnimatePresence>
                    {openQuote === 'victor-desktop' && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                      >
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-white/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                          </svg>
                          <p className="text-white text-sm leading-relaxed italic">
                            {t('team.victor.quote')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">
                        {t('team.victor.name')}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">{t('team.victor.role')}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <img
                        src="/icons/diagonal-arrow.svg"
                        alt=""
                        className={`w-4 h-4 transition-transform duration-300 ${openQuote === 'victor-desktop' ? 'rotate-45' : ''} group-hover:rotate-45`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right container - Anselmo & Imane (shifted down) */}
          <div className="flex-1 bg-[#0b0b0b] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[32px] p-3 mt-16 transform -translate-x-3 max-w-[600px]">
            <div className="grid grid-cols-1 gap-3">
              {/* Card 3 - Anselmo */}
              <div
                className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
                onClick={() => toggleQuote('anselmo-desktop')}
              >
                <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                    <OptimizedImage
                      src="/img/nome.jpg"
                      alt="Anselmo"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  {/* Quote Panel */}
                  <AnimatePresence>
                    {openQuote === 'anselmo-desktop' && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                      >
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-white/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                          </svg>
                          <p className="text-white text-sm leading-relaxed italic">
                            {t('team.anselmo.quote')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">
                        {t('team.anselmo.name')}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">{t('team.anselmo.role')}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <img
                        src="/icons/diagonal-arrow.svg"
                        alt=""
                        className={`w-4 h-4 transition-transform duration-300 ${openQuote === 'anselmo-desktop' ? 'rotate-45' : ''} group-hover:rotate-45`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4 - Imane */}
              <div
                className="bg-[#121212] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden transition-all duration-300 cursor-pointer group"
                onClick={() => toggleQuote('imane-desktop')}
              >
                <div className="aspect-square relative rounded-t-2xl overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                    <OptimizedImage
                      src="/img/imane.jpg"
                      alt="Imane"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  {/* Quote Panel */}
                  <AnimatePresence>
                    {openQuote === 'imane-desktop' && (
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 rounded-t-[20px]"
                      >
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-white/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                          </svg>
                          <p className="text-white text-sm leading-relaxed italic">
                            {t('team.imane.quote')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">
                        {t('team.imane.name')}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">{t('team.imane.role')}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <img
                        src="/icons/diagonal-arrow.svg"
                        alt=""
                        className={`w-4 h-4 transition-transform duration-300 ${openQuote === 'imane-desktop' ? 'rotate-45' : ''} group-hover:rotate-45`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
