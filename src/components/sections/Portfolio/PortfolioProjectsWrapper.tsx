'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Filter from '@/components/ui/Filter';
import FilterButton from '@/components/ui/FilterButton';
import Project from '@/components/ui/Project';
import { usePortfolioFiltersAnimation } from '@/hooks';
import type { Project as ProjectType } from '@/lib/serverActions';

const baseMainFilters = ['All', 'Web Design'];
const smResponsiveFilter = 'Branding';
const mdResponsiveFilter = 'Project Management';
const remainingFilters = ['UI/UX', 'Social Media'];

interface PortfolioProjectsWrapperProps {
  projects: ProjectType[];
}

/**
 * Client Component: Gestisce solo i filtri e le interazioni
 * I progetti vengono renderizzati server-side e sono sempre visibili a Google
 */
export default function PortfolioProjectsWrapper({ projects }: PortfolioProjectsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);

  const {
    isExpanded,
    toggleExpansion,
    containerAnimationProps,
    getFilterAnimationProps,
    buttonAnimationProps,
  } = usePortfolioFiltersAnimation();

  // Filtra i progetti in base ai filtri attivi
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        !project.categories ||
        !Array.isArray(project.categories) ||
        project.categories.length === 0
      ) {
        return false;
      }

      if (activeFilters.includes('All')) return true;

      return project.categories.some((category) => activeFilters.includes(category));
    });
  }, [projects, activeFilters]);

  // Chiudi espansione quando si clicca fuori
  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        toggleExpansion();
      }
    }

    document.addEventListener('mousedown', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleExpansion]);

  const handleFilterSelect = useCallback((filter: string) => {
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

  const handleMainFilterSelect = useCallback((filter: string) => {
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

  const handleProjectClick = useCallback((project: ProjectType) => {
    if (project.link) {
      const url =
        project.link.startsWith('http://') || project.link.startsWith('https://')
          ? project.link
          : `https://${project.link}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Render layout personalizzato
  const renderCustomLayout = useMemo(() => {
    const projectsToShow = filteredProjects;
    const rows = [];
    let projectIndex = 0;

    while (projectIndex < projectsToShow.length) {
      const rowIndex = rows.length;
      const rowType = rowIndex % 3;

      if (rowType === 0) {
        // Prima riga: 2 progetti 50% width
        const rowProjects = projectsToShow.slice(projectIndex, projectIndex + 2);
        if (rowProjects.length > 0) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-4 mb-6">
              {rowProjects.map((project) => (
                <div key={project.id} className="w-1/2">
                  <Project
                    title={project.title}
                    description={project.description}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </div>
              ))}
            </div>
          );
        }
        projectIndex += 2;
      } else if (rowType === 1) {
        // Seconda riga: 3 progetti 33% width
        const rowProjects = projectsToShow.slice(projectIndex, projectIndex + 3);
        if (rowProjects.length > 0) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-4 mb-6">
              {rowProjects.map((project) => (
                <div key={project.id} className="w-1/3">
                  <Project
                    title={project.title}
                    description={project.description}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </div>
              ))}
            </div>
          );
        }
        projectIndex += 3;
      } else {
        // Terza riga: 2 progetti - uno 33% l'altro 67%
        const rowProjects = projectsToShow.slice(projectIndex, projectIndex + 2);
        if (rowProjects.length > 0) {
          rows.push(
            <div key={`row-${rowIndex}`} className="flex gap-4 mb-6">
              {rowProjects.length >= 1 && (
                <div key={rowProjects[0].id} className="w-1/3">
                  <Project
                    title={rowProjects[0].title}
                    description={rowProjects[0].description}
                    imageUrl={rowProjects[0].image_url}
                    hasLink={!!rowProjects[0].link}
                    onClick={
                      rowProjects[0].link ? () => handleProjectClick(rowProjects[0]) : undefined
                    }
                  />
                </div>
              )}
              {rowProjects.length >= 2 && (
                <div key={rowProjects[1].id} className="w-2/3">
                  <Project
                    title={rowProjects[1].title}
                    description={rowProjects[1].description}
                    imageUrl={rowProjects[1].image_url}
                    hasLink={!!rowProjects[1].link}
                    onClick={
                      rowProjects[1].link ? () => handleProjectClick(rowProjects[1]) : undefined
                    }
                  />
                </div>
              )}
            </div>
          );
        }
        projectIndex += 2;
      }
    }

    return rows;
  }, [filteredProjects, handleProjectClick]);

  // Render layout responsivo
  const renderResponsiveLayout = useMemo(() => {
    const projectsToShow = filteredProjects;

    return (
      <div>
        {/* Layout Mobile: < md (768px) - 1 progetto per riga */}
        <div className="block md:hidden space-y-6">
          {projectsToShow.map((project) => (
            <div key={project.id}>
              <Project
                title={project.title}
                description={project.description}
                imageUrl={project.image_url}
                hasLink={!!project.link}
                onClick={project.link ? () => handleProjectClick(project) : undefined}
              />
            </div>
          ))}
        </div>

        {/* Layout Tablet: md - xl (768px - 1280px) - 2 progetti per riga */}
        <div className="hidden md:block xl:hidden space-y-6">
          {Array.from({ length: Math.ceil(projectsToShow.length / 2) }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-6">
              {projectsToShow.slice(rowIndex * 2, rowIndex * 2 + 2).map((project) => (
                <div key={project.id} className="w-1/2">
                  <Project
                    title={project.title}
                    description={project.description}
                    imageUrl={project.image_url}
                    hasLink={!!project.link}
                    onClick={project.link ? () => handleProjectClick(project) : undefined}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Layout Desktop: ≥ xl (1280px) - Layout personalizzato */}
        <div className="hidden xl:block">{renderCustomLayout}</div>
      </div>
    );
  }, [filteredProjects, handleProjectClick, renderCustomLayout]);

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

        {/* Layout Progetti */}
        <div className="w-full">{renderResponsiveLayout}</div>
      </div>
    </section>
  );
}

