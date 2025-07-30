'use client';

import React from 'react';
import ServiceCategory from '@/components/ui/ServiceCategory';
import { useTranslation } from '@/hooks/useTranslation';

export default function Services() {
  const { t } = useTranslation();

  return (
    <section className="section-scroll h-auto w-full flex items-start mt-0 py-[75px]">
      <div className="w-full flex flex-col">
        <ServiceCategory
          number={t('services.service01.number')}
          title={t('services.service01.title')}
          labels={t('services.service01.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service01.paragraph')}
          categorySlug="ui-ux-design"
        />
        <ServiceCategory
          number={t('services.service02.number')}
          title={t('services.service02.title')}
          labels={t('services.service02.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service02.paragraph')}
          categorySlug="project-management"
        />
        <ServiceCategory
          number={t('services.service03.number')}
          title={t('services.service03.title')}
          labels={t('services.service03.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service03.paragraph')}
          categorySlug="advertising"
        />
        <ServiceCategory
          number={t('services.service04.number')}
          title={t('services.service04.title')}
          labels={t('services.service04.labels', { returnObjects: true }) as string[]}
          paragraph={t('services.service04.paragraph')}
          categorySlug="social-media-design"
        />
      </div>
    </section>
  );
}
