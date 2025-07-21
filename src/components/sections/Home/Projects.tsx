'use client';

import React from 'react';
import Project from '../../ui/Project';
import { useProjectSwitch, ProjectData } from '../../animations/useProjectSwitch';

const projectsData: ProjectData[] = [
  {
    id: 'mavimatt',
    title: 'Mavimatt',
    image: '/img/Mavimatt.webp',
    backgroundImage: '/img/MavimattBackground.webp',
    labels: ['Project Management', 'Branding'],
  },
  {
    id: 'legacy',
    title: 'L.O.G.',
    image: '/img/Legacy.webp',
    backgroundImage: '/img/LegacyBackground.webp',
    labels: ['Project Management', 'Branding'],
  },
];

export default function Projects() {
  const { currentProject, goToNext, goToPrevious } = useProjectSwitch(projectsData);

  return (
    <section className="h-[800px] w-full flex items-center justify-center">
      <Project
        title={currentProject.title}
        image={currentProject.image}
        backgroundImage={currentProject.backgroundImage}
        labels={currentProject.labels}
        currentProjectId={currentProject.id}
        onLeftArrowClick={goToPrevious}
        onRightArrowClick={goToNext}
      />
    </section>
  );
}
