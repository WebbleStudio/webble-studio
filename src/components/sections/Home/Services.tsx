'use client';

import React, { useMemo } from 'react';
import ServiceCategory from '@/components/ui/ServiceCategory';
import { useTranslation } from '@/hooks';
import type { EnrichedServiceCategory } from '@/lib/serverActions';

interface ServicesProps {
  serviceCategories: EnrichedServiceCategory[];
}

export default function Services({ serviceCategories }: ServicesProps) {
  const { t } = useTranslation();
  
  // Helper per ottenere progetti per categoria
  const getProjectsForCategory = useMemo(() => {
    return (categorySlug: string) => {
      const category = serviceCategories.find((cat) => cat.slug === categorySlug);
      return category?.projects || [];
    };
  }, [serviceCategories]);

  return (
    <section id="services-section" className="section-scroll h-auto w-full flex items-start mt-0 py-[75px]">
      <div className="w-full flex flex-col">
        <ServiceCategory
          number={t('services.service01.number')}
          title={t('services.service01.title')}
          labels={t('services.service01.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service01.paragraph')}
          categorySlug="ui-ux-design"
          categoryProjects={getProjectsForCategory('ui-ux-design')}
          index={0}
        />
        <ServiceCategory
          number={t('services.service02.number')}
          title={t('services.service02.title')}
          labels={t('services.service02.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service02.paragraph')}
          categorySlug="project-management"
          categoryProjects={getProjectsForCategory('project-management')}
          index={1}
        />
        <ServiceCategory
          number={t('services.service03.number')}
          title={t('services.service03.title')}
          labels={t('services.service03.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service03.paragraph')}
          categorySlug="advertising"
          categoryProjects={getProjectsForCategory('advertising')}
          index={2}
        />
        <ServiceCategory
          number={t('services.service04.number')}
          title={t('services.service04.title')}
          labels={t('services.service04.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service04.paragraph')}
          categorySlug="social-media-design"
          categoryProjects={getProjectsForCategory('social-media-design')}
          index={3}
        />
      </div>
    </section>
  );
}
