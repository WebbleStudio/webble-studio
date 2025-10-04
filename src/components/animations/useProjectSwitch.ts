'use client';

import { useState, useCallback } from 'react';
import { projectAnimationVariants } from './projectAnimations';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  labels: string[];
  date?: string;
}

// New interfaces for slide-based navigation
export interface ProjectSlide {
  id: string;
  description: string;
  image: string;
}

export interface SingleProjectData {
  id: string;
  title: string;
  backgroundImage: string;
  labels: string[];
  date: string;
  slides: ProjectSlide[];
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
    animations: projectAnimationVariants,
  };
};

// New hook for slide navigation within a single project
export const useSlideSwitch = (project: SingleProjectData) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % project.slides.length);
      setIsTransitioning(false);
    }, 150);
  }, [project.slides.length, isTransitioning]);

  const goToPreviousSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev - 1 + project.slides.length) % project.slides.length);
      setIsTransitioning(false);
    }, 150);
  }, [project.slides.length, isTransitioning]);

  const currentSlide = project.slides[currentSlideIndex];

  return {
    // Data
    currentSlide,
    currentSlideIndex,
    totalSlides: project.slides.length,

    // Project fixed data
    projectData: {
      id: project.id,
      title: project.title,
      backgroundImage: project.backgroundImage,
      labels: project.labels,
      date: project.date,
    },

    // State
    isTransitioning,

    // Actions
    goToNext: goToNextSlide,
    goToPrevious: goToPreviousSlide,

    // Animation variants
    animations: projectAnimationVariants,
  };
};
