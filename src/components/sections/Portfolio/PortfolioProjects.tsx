'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Filter from '@/components/ui/Filter';
import FilterButton from '@/components/ui/FilterButton';
import Project from '@/components/ui/Project';
import { usePortfolioFiltersAnimation, usePortfolioProjectsAnimation } from '@/hooks';

const baseMainFilters = ['All', 'Web Desing'];
const smResponsiveFilter = 'Branding';
const mdResponsiveFilter = 'Project Management';
const remainingFilters = [
  'Social Media',
  'Advertising'
];

// Progetti di esempio
const projectsData = [
  {
    id: 1,
    title: 'Mavimatt',
    category: 'Printing Design',
    filters: ['Branding']
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    category: 'Web Development',
    filters: ['Web Desing']
  },
  {
    id: 3,
    title: 'Brand Identity',
    category: 'Visual Design',
    filters: ['Branding']
  },
  {
    id: 4,
    title: 'Social Campaign',
    category: 'Digital Marketing',
    filters: ['Social Media', 'Advertising']
  },
  {
    id: 5,
    title: 'Project Tracker',
    category: 'Dashboard Design',
    filters: ['Project Management']
  },
  {
    id: 6,
    title: 'Mobile App',
    category: 'UI/UX Design',
    filters: ['Web Desing']
  },
  {
    id: 7,
    title: 'Corporate Website',
    category: 'Web Design',
    filters: ['Branding', 'Web Desing']
  }
];

export default function PortfolioProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  
  const {
    isExpanded,
    toggleExpansion,
    containerAnimationProps,
    getFilterAnimationProps,
    buttonAnimationProps,
  } = usePortfolioFiltersAnimation();

  const {
    animationKey,
    triggerFilterAnimation,
    containerAnimationProps: projectsContainerProps,
    getProjectAnimationProps,
    getXLProjectAnimationProps,
    emptyStateAnimationProps,
  } = usePortfolioProjectsAnimation();

  // Filtra i progetti in base ai filtri attivi
  const filteredProjects = projectsData.filter(project => {
    if (activeFilters.includes('All')) return true;
    return project.filters.some(filter => activeFilters.includes(filter));
  });

  // Trigger animation quando cambiano i filtri
  useEffect(() => {
    triggerFilterAnimation();
  }, [activeFilters, triggerFilterAnimation]);

  // Chiudi espansione quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded) {
          toggleExpansion();
        }
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleExpansion]);

  const handleFilterSelect = (filter: string) => {
    console.log('Selected filter:', filter);
    
    if (filter === 'All') {
      // Se clicco "All", deseleziona tutti gli altri
      setActiveFilters(['All']);
    } else {
      setActiveFilters(prev => {
        // Rimuovi "All" se presente
        const withoutAll = prev.filter(f => f !== 'All');
        
        if (withoutAll.includes(filter)) {
          // Se il filtro è già attivo, rimuovilo
          const newFilters = withoutAll.filter(f => f !== filter);
          // Se non rimane nessun filtro, torna a "All"
          return newFilters.length === 0 ? ['All'] : newFilters;
        } else {
          // Se il filtro non è attivo, aggiungilo
          return [...withoutAll, filter];
        }
      });
    }
    // NON chiudere il dropdown - rimosso toggleExpansion()
  };

  const handleMainFilterSelect = (filter: string) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
    } else {
      setActiveFilters(prev => {
        const withoutAll = prev.filter(f => f !== 'All');
        
        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter(f => f !== filter);
          return newFilters.length === 0 ? ['All'] : newFilters;
        } else {
          return [...withoutAll, filter];
        }
      });
    }
  };

  const handleProjectClick = (project: typeof projectsData[0]) => {
    console.log('Clicked project:', project.title);
  };

  return (
    <section className="h-auto min-h-screen flex flex-col">
      <div className="flex flex-col items-start gap-6" ref={containerRef}>
        {/* Sezione Filtri */}
        <div className="flex flex-col items-start gap-2 w-full">
          {/* Prima riga con filtri principali responsivi */}
          <div className="flex items-start gap-2 flex-wrap">
            {/* Filtri base sempre visibili */}
            {baseMainFilters.map((filter) => (
              <Filter 
                key={filter}
                active={activeFilters.includes(filter)}
                onClick={() => handleMainFilterSelect(filter)}
              >
                {filter}
              </Filter>
            ))}
            
            {/* Branding appare da SM+ */}
            <div className="hidden sm:block">
              <Filter 
                active={activeFilters.includes(smResponsiveFilter)}
                onClick={() => handleMainFilterSelect(smResponsiveFilter)}
              >
                {smResponsiveFilter}
              </Filter>
            </div>
            
            {/* Project Management appare da MD+ */}
            <div className="hidden md:block">
              <Filter 
                active={activeFilters.includes(mdResponsiveFilter)}
                onClick={() => handleMainFilterSelect(mdResponsiveFilter)}
              >
                {mdResponsiveFilter}
              </Filter>
            </div>
            
            {/* Tutti i filtri rimanenti appaiono da LG+ */}
            <div className="hidden lg:flex lg:items-start lg:gap-2">
              {remainingFilters.map((filter) => (
                <Filter 
                  key={filter}
                  active={activeFilters.includes(filter)}
                  onClick={() => handleMainFilterSelect(filter)}
                >
                  {filter}
                </Filter>
              ))}
            </div>
            
            {/* FilterButton sparisce da LG+ */}
            <div className="block lg:hidden">
              <motion.div {...buttonAnimationProps}>
                <FilterButton onClick={toggleExpansion} />
              </motion.div>
            </div>
          </div>
          
          {/* Dropdown con filtri aggiuntivi - sparisce da LG+ */}
          <div className="block lg:hidden">
            <motion.div 
              className="flex items-start gap-2 flex-wrap"
              {...containerAnimationProps}
            >
              {/* Branding appare solo su mobile nel dropdown */}
              <div className="block sm:hidden">
                <motion.div {...getFilterAnimationProps(0)}>
                  <Filter 
                    active={activeFilters.includes(smResponsiveFilter)}
                    onClick={() => handleFilterSelect(smResponsiveFilter)}
                  >
                    {smResponsiveFilter}
                  </Filter>
                </motion.div>
              </div>
              
              {/* Project Management appare su SM ma sparisce da MD+ */}
              <div className="block md:hidden">
                <motion.div {...getFilterAnimationProps(1)}>
                  <Filter 
                    active={activeFilters.includes(mdResponsiveFilter)}
                    onClick={() => handleFilterSelect(mdResponsiveFilter)}
                  >
                    {mdResponsiveFilter}
                  </Filter>
                </motion.div>
              </div>
              
              {/* Filtri rimanenti nel dropdown fino a LG */}
              {remainingFilters.map((filter, index) => (
                <motion.div
                  key={index}
                  {...getFilterAnimationProps(index + 2)} // +2 per compensare Branding e Project Management
                >
                  <Filter 
                    active={activeFilters.includes(filter)}
                    onClick={() => handleFilterSelect(filter)}
                  >
                    {filter}
                  </Filter>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Griglia Progetti con Animazioni */}
        <div className="w-full">
          {/* Layout normale per schermi < XL */}
          <div className="xl:hidden">
            <AnimatePresence mode="wait" key="normal-layout">
              <motion.div 
                key={`normal-${animationKey}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    {...getProjectAnimationProps(index)}
                  >
                    <Project
                      title={project.title}
                      category={project.category}
                      onClick={() => handleProjectClick(project)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Layout personalizzato per XL+ con animazioni */}
          <div className="hidden xl:block">
            <AnimatePresence mode="wait" key="xl-layout">
              <motion.div 
                key={`xl-${animationKey}`}
                className="space-y-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: Math.ceil(filteredProjects.length / 7) }).map((_, groupIndex) => {
                  const startIndex = groupIndex * 7;
                  const groupProjects = filteredProjects.slice(startIndex, startIndex + 7);
                  
                  return (
                    <div key={groupIndex} className="space-y-10">
                      {/* Prima riga: 2 progetti (50/50) - anche se ce n'è solo 1 */}
                      {groupProjects.length > 0 && (
                        <div className="flex gap-10">
                          {groupProjects.slice(0, 2).map((project, index) => (
                            <motion.div
                              key={project.id}
                              className="w-1/2"
                              {...getXLProjectAnimationProps(0, index)}
                            >
                              <Project
                                title={project.title}
                                category={project.category}
                                onClick={() => handleProjectClick(project)}
                              />
                            </motion.div>
                          ))}
                          {/* Spazio vuoto se c'è solo 1 progetto nella prima riga */}
                          {groupProjects.length === 1 && (
                            <div className="w-1/2"></div>
                          )}
                        </div>
                      )}

                      {/* Seconda riga: 3 progetti (33/33/33) - si adatta al numero disponibile */}
                      {groupProjects.length > 2 && (
                        <div className="flex gap-10 justify-start">
                          {groupProjects.slice(2, 5).map((project, index) => (
                            <motion.div
                              key={project.id}
                              className="w-1/3"
                              {...getXLProjectAnimationProps(1, index)}
                            >
                              <Project
                                title={project.title}
                                category={project.category}
                                onClick={() => handleProjectClick(project)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Terza riga: 2 progetti (30/70) - si adatta al numero disponibile */}
                      {groupProjects.length > 5 && (
                        <div className="flex gap-10">
                          {groupProjects.slice(5, 7).map((project, index) => (
                            <motion.div
                              key={project.id}
                              className={index === 0 ? "w-[30%]" : "w-[70%]"}
                              {...getXLProjectAnimationProps(2, index)}
                            >
                              <Project
                                title={project.title}
                                category={project.category}
                                onClick={() => handleProjectClick(project)}
                              />
                            </motion.div>
                          ))}
                          {/* Spazio vuoto se c'è solo 1 progetto nella terza riga */}
                          {groupProjects.slice(5, 7).length === 1 && (
                            <div className="w-[70%]"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Messaggio se nessun progetto con animazione */}
          <AnimatePresence>
            {filteredProjects.length === 0 && (
              <motion.div 
                className="text-center py-12"
                {...emptyStateAnimationProps}
              >
                <p className="text-black/60 dark:text-white/60 text-lg">
                  Nessun progetto trovato per i filtri selezionati
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
} 