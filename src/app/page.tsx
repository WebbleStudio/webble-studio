import { createClient } from '@supabase/supabase-js';
import Container from '@/components/layout/Container';
import Hero2 from '@/components/sections/Home/Hero2';
import Payoff from '@/components/sections/Home/Payoff';
import KeyPoints from '@/components/sections/Home/KeyPoints';
import ServicesStatic from '@/components/sections/Home/ServicesStatic';
import Projects from '@/components/sections/Home/Projects';
import Contact from '@/components/sections/Home/Contact';
import { SingleProjectData } from '@/components/animations/useProjectSwitch';

// Funzione per creare placeholder vuoti
const createPlaceholderProject = (position: number): SingleProjectData => ({
  id: `placeholder-${position}`,
  title: `Progetto ${position}`,
  backgroundImage: '/img/sfondo-box3.png',
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

// Funzione per convertire HeroProject in SingleProjectData
const convertHeroProjectToSingleProject = (
  heroProject: any,
  allProjects: any[]
): SingleProjectData => {
  const project = allProjects.find((p: any) => p.id === heroProject.project_id);

  if (!project) {
    return createPlaceholderProject(heroProject.position);
  }

  const slideImages = heroProject.images.length > 0 ? heroProject.images : [project.image_url];

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

// Server-side data fetching (STATICO - esegue al BUILD TIME)
async function getHomePageData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch hero projects
  const { data: heroProjects } = await supabase
    .from('hero-projects')
    .select('*')
    .order('position', { ascending: true });

  // Fetch all projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('order_position', { ascending: true });

  // Fetch service categories
  const { data: serviceCategories } = await supabase
    .from('service-categories')
    .select('*');

  // Costruisci serviceImages map
  const serviceImages: Record<string, any[]> = {};
  if (serviceCategories && projects) {
    for (const category of serviceCategories) {
      const categoryProjects = category.images
        .map((projectId: string) => projects.find((p: any) => p.id === projectId))
        .filter(Boolean);
      serviceImages[category.slug] = categoryProjects;
    }
  }

  return {
    heroProjects: heroProjects || [],
    projects: projects || [],
    serviceImages,
  };
}

// Server Component - genera HTML statico al build
export default async function Home() {
  // Fetch data server-side al build time (1 sola volta)
  const { heroProjects, projects, serviceImages } = await getHomePageData();

  // Convert hero projects to display format
  const displayProjects: SingleProjectData[] = [];
  for (let position = 1; position <= 4; position++) {
    const heroProject = heroProjects.find((hp: any) => hp.position === position);
    if (heroProject) {
      displayProjects.push(convertHeroProjectToSingleProject(heroProject, projects));
    } else {
      displayProjects.push(createPlaceholderProject(position));
    }
  }

  return (
    <main>
      <Hero2 />
      <Payoff />
      <Container>
        <KeyPoints />
        <ServicesStatic serviceImages={serviceImages} />
      </Container>

      {/* Sezione Progetti con effetto stacking sticky */}
      <section className="relative">
        <div className="relative">
          {displayProjects.map((project, index) => {
            const zIndexClasses = ['z-10', 'z-20', 'z-30', 'z-40'];
            const zIndexClass = zIndexClasses[index] || 'z-10';

            return (
              <div key={project.id} className={`sticky top-0 h-screen ${zIndexClass}`}>
                <Projects projectData={project} />
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

// Forza la rigenerazione statica SOLO on-demand (quando admin clicca "Aggiorna Sito")
export const revalidate = false;
