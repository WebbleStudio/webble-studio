'use client';

import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function Team() {
  return (
    <section className="w-full pt-[50px]">
        <div className="w-full max-w-[1370px] mx-auto md:py-[40px] lg:px-[100px] xl:px-[150px] xl:py-[75px]">
        {/* Team cards container */}
        {/* Mobile: Grid layout */}
        <div className="bg-[#0b0b0b] rounded-[32px] border border-[#f4f4f4]/10 p-3 md:hidden">
          <div className="grid grid-cols-1 gap-6">
          {/* Card 1 - Matais */}
          <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="aspect-square relative rounded-b-2xl overflow-hidden">
              <OptimizedImage
                src="/img/matias.jpg"
                alt="Matias"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-4 bg-[#121212]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-medium">Matais Plaza</h3>
                  <p className="text-white/70 text-sm sm:text-base">SMM, Fotografo, Videomaker</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/70 group-hover:text-white transition-colors"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 - Gabriele */}
          <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="aspect-square relative rounded-b-2xl overflow-hidden">
              <OptimizedImage
                src="/img/gabriele.png"
                alt="Gabriele"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-4 bg-[#121212]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-medium">Gabriele</h3>
                  <p className="text-white/70 text-sm sm:text-base">Design specialist</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/70 group-hover:text-white transition-colors"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 - Nome */}
          <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="aspect-square relative rounded-b-2xl overflow-hidden">
              <OptimizedImage
                src="/img/nome.jpg"
                alt="Nome"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-4 bg-[#121212]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-medium">Anselmo D. G. Vicente</h3>
                  <p className="text-white/70 text-sm sm:text-base">Developer e Designer</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/70 group-hover:text-white transition-colors"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 - Imane */}
          <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
            <div className="aspect-square relative rounded-b-2xl overflow-hidden">
              <OptimizedImage
                src="/img/imane.jpg"
                alt="Imane"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-4 bg-[#121212]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-medium">Imane Eshakhi</h3>
                  <p className="text-white/70 text-sm sm:text-base">Graphic and Motion Designer</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/70 group-hover:text-white transition-colors"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
              <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="aspect-square relative rounded-b-2xl overflow-hidden">
                  <OptimizedImage
                    src="/img/matias.jpg"
                    alt="Matias"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">Matias Plaza</h3>
                      <p className="text-white/70 text-sm sm:text-base">SMM, Fotografo, Videomaker</p>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white/70 group-hover:text-white transition-colors"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 - Gabriele */}
              <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="aspect-square relative rounded-b-2xl overflow-hidden">
                  <OptimizedImage
                    src="/img/gabriele.png"
                    alt="Gabriele"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">Gabriele</h3>
                      <p className="text-white/70 text-sm sm:text-base">Design specialist</p>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white/70 group-hover:text-white transition-colors"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right container - Nome & Imane (shifted down) */}
          <div className="flex-1 bg-[#0b0b0b] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[32px] p-3 mt-16 transform -translate-x-3 max-w-[600px]">
            <div className="grid grid-cols-1 gap-3">
              {/* Card 3 - Nome */}
              <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="aspect-square relative rounded-b-2xl overflow-hidden">
                  <OptimizedImage
                    src="/img/nome.jpg"
                    alt="Nome"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">Anselmo D. G. Vicente</h3>
                      <p className="text-white/70 text-sm sm:text-base">Developer e Designer</p>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white/70 group-hover:text-white transition-colors"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4 - Imane */}
              <div className="bg-[#1a1a1a] border border-[#f4f4f4]/10 rounded-[21px] overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="aspect-square relative rounded-b-2xl overflow-hidden">
                  <OptimizedImage
                    src="/img/imane.jpg"
                    alt="Imane"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-4 bg-[#121212]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg sm:text-xl font-medium">Imane Eshakhi</h3>
                      <p className="text-white/70 text-sm sm:text-base">Graphic and Motion Designer</p>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white/70 group-hover:text-white transition-colors"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
