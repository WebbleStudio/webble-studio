'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Filter from '@/components/ui/Filter';
import FilterButton from '@/components/ui/FilterButton';
import Project from '@/components/ui/Project';
import { usePortfolioFiltersAnimation, usePortfolioProjectsAnimation } from '@/hooks';
import { useProjects } from '@/hooks/useProjects';

const baseMainFilters = ['All', 'Web Design'];
const smResponsiveFilter = 'Branding';
const mdResponsiveFilter = 'Project Management';
const remainingFilters = ['UI/UX', 'Social Media'];

interface PortfolioProjectsProps {
  // Rimosso layoutMode - ora completamente responsivo
}

// Componente Scheletro
const ProjectSkeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`bg-border-primary-20 rounded-[25px] border-2 border-dashed border-text-primary-60 ${className}`}
  >
    <div className="aspect-video bg-text-primary-60/10 rounded-t-[23px] flex items-center justify-center">
      <div className="text-center text-text-primary-60">
        <div className="w-12 h-12 mx-auto mb-2 bg-text-primary-60/20 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-xs">Project Slot</p>
      </div>
    </div>
    <div className="p-4">
      <div className="h-4 bg-text-primary-60/20 rounded mb-2"></div>
      <div className="h-3 bg-text-primary-60/10 rounded w-2/3"></div>
    </div>
  </div>
);

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

  const { projects, loading, error, fetchProjects } = useProjects();

  // Carica progetti all'avvio
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filtra i progetti in base ai filtri attivi
  const filteredProjects = projects.filter((project) => {
    if (activeFilters.includes('All')) return true;
    // Controlla se almeno una delle categorie del progetto è nei filtri attivi
    return project.categories.some((category) => activeFilters.includes(category));
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
      setActiveFilters(['All']);
    } else {
      setActiveFilters((prev) => {
        const withoutAll = prev.filter((f) => f !== 'All');

        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter((f) => f !== filter);
          return newFilters.length === 0 ? ['All'] : newFilters;
        } else {
          return [...withoutAll, filter];
        }
      });
    }
  };

  const handleMainFilterSelect = (filter: string) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
    } else {
      setActiveFilters((prev) => {
        const withoutAll = prev.filter((f) => f !== 'All');

        if (withoutAll.includes(filter)) {
          const newFilters = withoutAll.filter((f) => f !== filter);
          return newFilters.length === 0 ? ['All'] : newFilters;
        } else {
          return [...withoutAll, filter];
        }
      });
    }
  };

  const handleProjectClick = (project: (typeof projects)[0]) => {
    console.log('Clicked project:', project.title);

    // Apri il link del progetto se presente
    if (project.link) {
      // Verifica se il link ha già il protocollo
      const url =
        project.link.startsWith('http://') || project.link.startsWith('https://')
          ? project.link
          : `https://${project.link}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Nessun link disponibile per questo progetto');
    }
  };

  // Render layout responsivo automatico basato sui breakpoint
  const renderResponsiveLayout = () => {
    // Rimuoviamo il limite di 7 progetti per supportare la ripetizione ciclica
    const projectsToShow = filteredProjects;

    return (
      <div>
        {/* Layout Mobile: < md (768px) - 1 progetto per riga */}
        <div className="block md:hidden space-y-6">
          {projectsToShow.map((project, index) => (
            <motion.div key={project.id} {...getProjectAnimationProps(index)}>
              <Project
                title={project.title}
                category={project.categories.join(', ')}
                imageUrl={project.image_url}
                hasLink={!!project.link}
                onClick={project.link ? () => handleProjectClick(project) : undefined}
              />
            </motion.div>
          ))}
        </div>

        {/* Layout Tablet: md - xl (768px - 1280px) - 2 progetti per riga */}
        <div className="hidden md:block xl:hidden space-y-6">
          {Array.from({ length: Math.ceil(projectsToShow.length / 2) }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-6">
              {projectsToShow.slice(rowIndex * 2, rowIndex * 2 + 2).map((project, index) => (
                <motion.div
                  key={project.id}
                  className="w-1/2"
                  {...getProjectAnimationProps(rowIndex * 2 + index)}
                >
                  <Project
                    title={project.title}
                    category={project.categories.join(', ')}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Layout Desktop: ≥ xl (1280px) - Layout complesso con ripetizione ciclica */}
        <div className="hidden xl:block space-y-10">
          {renderXLLayoutWithCyclicalPattern(projectsToShow)}
        </div>
      </div>
    );
  };

  // Funzione per renderizzare il layout XL con pattern ciclico ogni 7 progetti
  const renderXLLayoutWithCyclicalPattern = (projects: typeof filteredProjects) => {
    const rows = [];
    const projectsPerPattern = 7; // Pattern si ripete ogni 7 progetti

    // Dividiamo i progetti in gruppi di 7
    for (let groupStart = 0; groupStart < projects.length; groupStart += projectsPerPattern) {
      const currentGroup = projects.slice(groupStart, groupStart + projectsPerPattern);
      const groupIndex = Math.floor(groupStart / projectsPerPattern);

      // Prima riga del gruppo: primi 2 progetti (se disponibili)
      if (currentGroup.length >= 1) {
        const firstRowProjects = currentGroup.slice(0, 2);
        rows.push(
          <div key={`group-${groupIndex}-row-0`} className="flex gap-10">
            {firstRowProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="w-1/2"
                {...getXLProjectAnimationProps(groupIndex * 3, index)} // Offset animazioni per gruppo
              >
                <Project
                  title={project.title}
                  category={project.categories.join(', ')}
                  imageUrl={project.image_url}
                  hasLink={!!project.link}
                  onClick={project.link ? () => handleProjectClick(project) : undefined}
                />
              </motion.div>
            ))}
          </div>
        );
      }

      // Seconda riga del gruppo: progetti 3-5 (se disponibili)
      if (currentGroup.length >= 3) {
        const secondRowProjects = currentGroup.slice(2, 5);
        rows.push(
          <div key={`group-${groupIndex}-row-1`} className="flex gap-10">
            {secondRowProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="w-1/3"
                {...getXLProjectAnimationProps(groupIndex * 3 + 1, index)} // Offset animazioni per gruppo
              >
                <Project
                  title={project.title}
                  category={project.categories.join(', ')}
                  imageUrl={project.image_url}
                  hasLink={!!project.link}
                  onClick={project.link ? () => handleProjectClick(project) : undefined}
                />
              </motion.div>
            ))}
          </div>
        );
      }

      // Terza riga del gruppo: progetti 6-7 (se disponibili)
      if (currentGroup.length >= 6) {
        const thirdRowProjects = currentGroup.slice(5, 7);
        rows.push(
          <div key={`group-${groupIndex}-row-2`} className="flex gap-10">
            {thirdRowProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={index === 0 ? 'w-[35%]' : 'w-[65%]'}
                {...getXLProjectAnimationProps(groupIndex * 3 + 2, index)} // Offset animazioni per gruppo
              >
                <Project
                  title={project.title}
                  category={project.categories.join(', ')}
                  imageUrl={project.image_url}
                  hasLink={!!project.link}
                  onClick={project.link ? () => handleProjectClick(project) : undefined}
                />
              </motion.div>
            ))}
          </div>
        );
      }
    }

    return rows;
  };

  return (
    <section className="h-auto min-h-screen flex flex-col py-16">
      <div className="flex flex-col items-start gap-8" ref={containerRef}>
        {/* Sezione Filtri */}
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-start gap-2 flex-wrap">
            {baseMainFilters.map((filter) => (
              <Filter
                key={filter}
                active={activeFilters.includes(filter)}
                onClick={() => handleMainFilterSelect(filter)}
              >
                {filter}
              </Filter>
            ))}

            <div className="hidden sm:block">
              <Filter
                active={activeFilters.includes(smResponsiveFilter)}
                onClick={() => handleMainFilterSelect(smResponsiveFilter)}
              >
                {smResponsiveFilter}
              </Filter>
            </div>

            <div className="hidden md:block">
              <Filter
                active={activeFilters.includes(mdResponsiveFilter)}
                onClick={() => handleMainFilterSelect(mdResponsiveFilter)}
              >
                {mdResponsiveFilter}
              </Filter>
            </div>

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

            <div className="block lg:hidden">
              <motion.div {...buttonAnimationProps}>
                <FilterButton onClick={toggleExpansion} />
              </motion.div>
            </div>
          </div>

          <div className="block lg:hidden">
            <motion.div className="flex items-start gap-2 flex-wrap" {...containerAnimationProps}>
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

              {remainingFilters.map((filter, index) => (
                <motion.div key={index} {...getFilterAnimationProps(index + 2)}>
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

        {/* Layout Preview */}
        <div className="w-full">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352]"></div>
              <span className="ml-3 text-text-primary-60">Caricamento progetti...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-200 text-center">
                Errore nel caricamento dei progetti: {error}
              </p>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <AnimatePresence mode="wait" key={`${animationKey}`}>
              <motion.div
                key={`${animationKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderResponsiveLayout()}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Messaggio se nessun progetto */}
          <AnimatePresence>
            {filteredProjects.length === 0 && (
              <motion.div className="text-center py-12" {...emptyStateAnimationProps}>
                <p className="text-text-primary-60 text-lg">
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
