'use client';

import React from 'react';
import Project from '../../ui/Project';
import { useProjectSwitch, ProjectData } from '../../animations/useProjectSwitch';

const projectsData: ProjectData[] = [
  {
    id: 'mavimatt',
    title: 'Mavimatt',
    description: 'La company profile del lusso',
    image: '/img/Mavimatt.webp',
    backgroundImage: '/img/MavimattBackground.webp',
    labels: ['Project Management', 'UI/UX Design', 'Branding', 'Social Media Design'],
    date: 'Maggio 2025',
  },
  {
    id: 'legacy',
    title: 'Legacy of Games',
    description: 'Il design del gaming virtuale',
    image: '/img/Legacy.webp',
    backgroundImage: '/img/LegacyBackground.webp',
    labels: ['Web Developement', 'Motion Design', '3D Styling', 'Interactive Design'],
    date: 'Maggio 2025',
  },
];

export default function Projects() {
  const { currentProject, goToNext, goToPrevious } = useProjectSwitch(projectsData);

  return (
    <section className="h-screen w-full flex items-center justify-center mt-[50px] mb-[50px]">
      <Project
        title={currentProject.title}
        description={currentProject.description}
        image={currentProject.image}
        backgroundImage={currentProject.backgroundImage}
        labels={currentProject.labels}
        currentProjectId={currentProject.id}
        date={currentProject.date}
        onLeftArrowClick={goToPrevious}
        onRightArrowClick={goToNext}
      />
    </section>
  );
}
