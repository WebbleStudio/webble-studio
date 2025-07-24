'use client';

import { useRef } from 'react';
import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Home/Hero';
import Payoff from '@/components/sections/Home/Payoff';
import KeyPoints from '@/components/sections/Home/KeyPoints';
import Services from '@/components/sections/Home/Services';
import Projects from '@/components/sections/Home/Projects';
import Contact from '@/components/sections/Home/Contact';
import { SingleProjectData } from '@/components/animations/useProjectSwitch';

// Configurazione Progetto 1 - Mavimatt
const project1: SingleProjectData = {
  id: 'mavimatt',
  title: 'Mavimatt',
  backgroundImage: '/img/MavimattBackground.webp',
  labels: ['Project Management', 'UI/UX Design', 'Branding', 'Social Media Design'],
  date: 'Maggio 2025',
  slides: [
    {
      id: 'slide-1',
      description: 'La company profile del lusso',
      image: '/img/Mavimatt.webp',
    },
    {
      id: 'slide-2',
      description: 'Il design esclusivo per il mercato premium',
      image: '/img/Mavimatt.webp',
    },
    {
      id: 'slide-3',
      description: "La creatività incontra l'eleganza italiana",
      image: '/img/Mavimatt.webp',
    },
  ],
};

// Configurazione Progetto 2 - Legacy of Games
const project2: SingleProjectData = {
  id: 'legacy',
  title: 'Legacy of Games',
  backgroundImage: '/img/LegacyBackground.webp',
  labels: ['Web Development', 'Motion Design', '3D Styling', 'Interactive Design'],
  date: 'Giugno 2025',
  slides: [
    {
      id: 'slide-1',
      description: 'Il futuro del gaming virtuale',
      image: '/img/Legacy.webp',
    },
    {
      id: 'slide-2',
      description: 'Esperienza immersiva senza precedenti',
      image: '/img/Legacy.webp',
    },
    {
      id: 'slide-3',
      description: "Dove la tecnologia incontra l'arte",
      image: '/img/Legacy.webp',
    },
  ],
};

// Configurazione Progetto 3 - X2M Creative
const project3: SingleProjectData = {
  id: 'x2mcreative',
  title: 'X2M Creative',
  backgroundImage: '/img/x2mcreative-background.webp',
  labels: ['Creative Direction', 'Brand Strategy', 'Visual Identity', 'Digital Marketing'],
  date: 'Luglio 2025',
  slides: [
    {
      id: 'slide-1',
      description: 'La creative agency di nuova generazione',
      image: '/img/x2mcreative.webp',
    },
    {
      id: 'slide-2',
      description: 'Innovazione e creatività senza limiti',
      image: '/img/Legacy.webp',
    },
    {
      id: 'slide-3',
      description: 'Il partner ideale per il tuo brand',
      image: '/img/Mavimatt.webp',
    },
  ],
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const payoffRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={payoffRef}>
        <Payoff />
      </div>
      <Container>
        <KeyPoints />
        <Services />
      </Container>
      <Projects projectData={project1} />
      <Projects projectData={project2} />
      <Projects projectData={project3} />
      <Container>
        <Contact />
      </Container>
    </main>
  );
}
