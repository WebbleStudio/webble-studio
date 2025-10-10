'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Filter from '@/components/ui/Filter';
import FilterButton from '@/components/ui/FilterButton';
import Project from '@/components/ui/Project';
import { usePortfolioFiltersAnimation, usePortfolioProjectsAnimation } from '@/hooks';
import { useProjectTranslation } from '@/hooks/useProjectTranslation';

const baseMainFilters = ['All', 'Web Design'];
const smResponsiveFilter = 'Branding';
const mdResponsiveFilter = 'Project Management';
const remainingFilters = ['UI/UX', 'Social Media'];

interface PortfolioProjectsStaticProps {
  projects: any[];
}

export default function PortfolioProjectsStatic({ projects }: PortfolioProjectsStaticProps) {
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

  const { getTranslatedTitle, getTranslatedDescription, currentLanguage } = useProjectTranslation();

  // Trigger re-render when language changes
  useEffect(() => {
  }, [currentLanguage]);

  // Filtra i progetti in base ai filtri attivi
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      if (activeFilters.includes('All')) return true;
      return project.categories.some((category: string) => activeFilters.includes(category));
    });
  }, [projects, activeFilters]);

  // Trigger animation quando cambiano i filtri
  useEffect(() => {
    triggerFilterAnimation();
  }, [activeFilters, triggerFilterAnimation]);

  // Chiudi espansione quando si clicca fuori
  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        toggleExpansion();
      }
    }

    document.addEventListener('mousedown', handleClickOutside, { passive: true } as any);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleExpansion]);

  const handleFilterSelect = React.useCallback((filter: string) => {
    setActiveFilters((prev) => {
      if (filter === 'All') {
        return ['All'];
      }

      const withoutAll = prev.filter((f) => f !== 'All');

      if (withoutAll.includes(filter)) {
        const newFilters = withoutAll.filter((f) => f !== filter);
        return newFilters.length === 0 ? ['All'] : newFilters;
      } else {
        return [...withoutAll, filter];
      }
    });
  }, []);

  const handleMainFilterSelect = React.useCallback((filter: string) => {
    setActiveFilters((prev) => {
      if (filter === 'All') {
        return ['All'];
      }

      const withoutAll = prev.filter((f) => f !== 'All');

      if (withoutAll.includes(filter)) {
        const newFilters = withoutAll.filter((f) => f !== filter);
        return newFilters.length === 0 ? ['All'] : newFilters;
      } else {
        return [...withoutAll, filter];
      }
    });
  }, []);

  const handleProjectClick = React.useCallback((project: (typeof projects)[0]) => {
    if (project.link) {
      const url =
        project.link.startsWith('http://') || project.link.startsWith('https://')
          ? project.link
          : `https://${project.link}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Layout personalizzato con pattern alternato
  const renderCustomLayout = React.useMemo(() => {
    const projectsToShow = filteredProjects;
    const rows = [];

    for (let i = 0; i < projectsToShow.length; i += 3) {
      const rowProjects = projectsToShow.slice(i, i + 3);
      const rowIndex = Math.floor(i / 3);

      if (rowIndex % 3 === 0) {
        if (rowProjects.length >= 2) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-6 mb-6">
              {rowProjects.slice(0, 2).map((project, index) => (
                <motion.div
                  key={project.id}
                  className="w-1/2"
                  {...getProjectAnimationProps(i + index)}
                >
                  <Project
                    title={getTranslatedTitle(project)}
                    description={getTranslatedDescription(project)}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          );
        }
      } else if (rowIndex % 3 === 1) {
        if (rowProjects.length >= 3) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-4 mb-6">
              {rowProjects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  className="w-1/3"
                  {...getProjectAnimationProps(i + index)}
                >
                  <Project
                    title={getTranslatedTitle(project)}
                    description={getTranslatedDescription(project)}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          );
        }
      } else {
        if (rowProjects.length >= 2) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-4 mb-6">
              <motion.div
                key={rowProjects[0].id}
                className="w-1/3"
                {...getProjectAnimationProps(i)}
              >
                <Project
                  title={getTranslatedTitle(rowProjects[0])}
                  description={getTranslatedDescription(rowProjects[0])}
                  imageUrl={rowProjects[0].image_url}
                  hasLink={!!rowProjects[0].link}
                  onClick={rowProjects[0].link ? () => handleProjectClick(rowProjects[0]) : undefined}
                />
              </motion.div>
              <motion.div
                key={rowProjects[1].id}
                className="w-2/3"
                {...getProjectAnimationProps(i + 1)}
              >
                <Project
                  title={getTranslatedTitle(rowProjects[1])}
                  description={getTranslatedDescription(rowProjects[1])}
                  imageUrl={rowProjects[1].image_url}
                  hasLink={!!rowProjects[1].link}
                  onClick={rowProjects[1].link ? () => handleProjectClick(rowProjects[1]) : undefined}
                />
              </motion.div>
            </div>
          );
        }
      }
    }

    return rows;
  }, [
    filteredProjects,
    getTranslatedTitle,
    getTranslatedDescription,
    handleProjectClick,
    getProjectAnimationProps,
  ]);

  // Render layout responsivo automatico
  const renderResponsiveLayout = React.useMemo(() => {
    const projectsToShow = filteredProjects;

    return (
      <div>
        {/* Layout Mobile */}
        <div className="block md:hidden space-y-6">
          {projectsToShow.map((project, index) => (
            <motion.div key={project.id} {...getProjectAnimationProps(index)}>
              <Project
                title={getTranslatedTitle(project)}
                description={getTranslatedDescription(project)}
                imageUrl={project.image_url}
                hasLink={!!project.link}
                onClick={project.link ? () => handleProjectClick(project) : undefined}
              />
            </motion.div>
          ))}
        </div>

        {/* Layout Tablet */}
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
                    title={getTranslatedTitle(project)}
                    description={getTranslatedDescription(project)}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Layout Desktop */}
        <div className="hidden xl:block">{renderCustomLayout}</div>
      </div>
    );
  }, [
    filteredProjects,
    getTranslatedTitle,
    getTranslatedDescription,
    handleProjectClick,
    getProjectAnimationProps,
    renderCustomLayout,
  ]);

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

        {/* Content */}
        <div className="w-full">
          <AnimatePresence mode="wait" key={`${animationKey}`}>
            <motion.div
              key={`${animationKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderResponsiveLayout}
            </motion.div>
          </AnimatePresence>

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

