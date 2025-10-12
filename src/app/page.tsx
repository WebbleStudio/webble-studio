'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import Hero2 from '@/components/sections/Home/Hero2';
import Payoff from '@/components/sections/Home/Payoff';
import KeyPoints from '@/components/sections/Home/KeyPoints';
import Services from '@/components/sections/Home/Services';
import Projects from '@/components/sections/Home/Projects';
import Contact from '@/components/sections/Home/Contact';
import { SingleProjectData } from '@/components/animations/useProjectSwitch';
import { useHomeData, EnrichedHeroProject, Project } from '@/hooks';

// Funzione per creare placeholder vuoti
const createPlaceholderProject = (position: number): SingleProjectData => ({
  id: `placeholder-${position}`,
  title: `Progetto ${position}`,
  backgroundImage: '/img/sfondo-box3.png', // Sfondo placeholder esistente
  labels: ['Coming Soon'],
  date: 'Prossimamente',
  slides: [
    {
      id: `placeholder-slide-1-${position}`,
      description: 'Questo progetto sarà configurato dalla sezione admin',
      image: '/img/sfondo-box3.png',
    },
    {
      id: `placeholder-slide-2-${position}`,
      description: 'Seleziona un progetto nella sezione Highlights',
      image: '/img/sfondo-box3.png',
    },
    {
      id: `placeholder-slide-3-${position}`,
      description: 'Configura descrizioni, immagini e sfondo',
      image: '/img/sfondo-box3.png',
    },
  ],
});

// Funzione per convertire EnrichedHeroProject in SingleProjectData
// Ottimizzato: il progetto è già joinato dal server
const convertHeroProjectToSingleProject = (heroProject: EnrichedHeroProject): SingleProjectData => {
  const project = heroProject.project;

  if (!project) {
    return createPlaceholderProject(heroProject.position);
  }

  // Usa le immagini configurate o fallback all'immagine del progetto
  const slideImages = heroProject.images.length > 0 ? heroProject.images : [project.image_url];

  // Crea le slides dalle descrizioni e immagini
  const slides = [0, 1, 2].map((index) => ({
    id: `slide-${index + 1}-${project.id}`,
    description: heroProject.descriptions[index] || 'Descrizione non configurata',
    image: slideImages[index % slideImages.length] || project.image_url,
  }));

  return {
    id: project.id,
    title: project.title,
    backgroundImage: heroProject.background_image || project.image_url,
    labels: project.categories,
    date:
      heroProject.project_date ||
      new Date(heroProject.created_at).toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric',
      }),
    slides,
  };
};

export default function Home() {
  const { heroProjects, loading, fetchHomeData } = useHomeData();
  const [displayProjects, setDisplayProjects] = useState<SingleProjectData[]>([]);

  // Carica tutti i dati home con una singola chiamata (cache 12 ore)
  useEffect(() => {
    fetchHomeData();
  }, []); // ✅ Dipendenze vuote per evitare loop

  // Aggiorna i progetti da mostrare quando cambiano hero projects
  useEffect(() => {
    const projectsToDisplay: SingleProjectData[] = [];

    // Crea sempre 4 progetti per mantenere l'effetto stacking
    for (let position = 1; position <= 4; position++) {
      const heroProject = heroProjects.find((hp) => hp.position === position);

      if (heroProject) {
        // Usa il progetto configurato (già joinato dal server!)
        projectsToDisplay.push(convertHeroProjectToSingleProject(heroProject));
      } else {
        // Usa placeholder
        projectsToDisplay.push(createPlaceholderProject(position));
      }
    }

    setDisplayProjects(projectsToDisplay);
  }, [heroProjects]);

  return (
    <main>
      <Hero2 />
      <Payoff />
      <Container>
        <KeyPoints />
        <Services />
      </Container>

      {/* Sezione Progetti con effetto stacking sticky */}
      <section className="relative">
        {/* Container per l'effetto stacking */}
        <div className="relative">
          {displayProjects.length > 0
            ? displayProjects.map((project, index) => {
                // Z-index statici per Tailwind CSS
                const zIndexClasses = ['z-10', 'z-20', 'z-30', 'z-40'];
                const zIndexClass = zIndexClasses[index] || 'z-10';

                return (
                  <div key={project.id} className={`sticky top-0 h-screen ${zIndexClass}`}>
                    <Projects projectData={project} />
                  </div>
                );
              })
            : // Fallback durante il caricamento - mostra 4 placeholder
              [1, 2, 3, 4].map((position, index) => {
                const zIndexClasses = ['z-10', 'z-20', 'z-30', 'z-40'];
                const zIndexClass = zIndexClasses[index] || 'z-10';

                return (
                  <div
                    key={`loading-${position}`}
                    className={`sticky top-0 h-screen ${zIndexClass}`}
                  >
                    <Projects projectData={createPlaceholderProject(position)} />
                  </div>
                );
              })}
        </div>
      </section>
      <Container>
        <Contact />
      </Container>
    </main>
  );
}
