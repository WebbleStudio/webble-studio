"use client";

import { useState, useCallback } from 'react';
import { projectAnimationVariants } from './projectAnimations';

export interface ProjectData {
  id: string;
  title: string;
  image: string;
  backgroundImage: string;
  labels: string[];
}

export const useProjectSwitch = (projects: ProjectData[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
      setIsTransitioning(false);
    }, 150);
  }, [projects.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      setIsTransitioning(false);
    }, 150);
  }, [projects.length, isTransitioning]);

  const currentProject = projects[currentIndex];

  return {
    // Data
    currentProject,
    currentIndex,
    totalProjects: projects.length,
    
    // State
    isTransitioning,
    
    // Actions
    goToNext,
    goToPrevious,
    
    // Animation variants (imported from separate file)
    animations: projectAnimationVariants
  };
}; 