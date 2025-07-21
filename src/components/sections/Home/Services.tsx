import React from 'react';
import ServiceCategory from '@/components/ui/ServiceCategory';

export default function Services() {
  return (
    <section className="h-[autopx] md:h-screen w-full flex items-start mt-20">
      <div className="w-full flex flex-col">
        <ServiceCategory
          number="01"
          title="UI/UX Design"
          labels={['User Interface', 'User Experience', 'Progettazione']}
          paragraph="Ogni interfaccia racconta una storia. Noi la progettiamo per essere impossibile da dimenticare."
        />
        <ServiceCategory
          number="02"
          title="Project Management"
          labels={['User Interface', 'User Experience', 'Progettazione']}
          paragraph="Ogni interfaccia racconta una storia. Noi la progettiamo per essere impossibile da dimenticare."
        />
        <ServiceCategory
          number="03"
          title="Advertising"
          labels={['User Interface', 'User Experience', 'Progettazione']}
          paragraph="Ogni interfaccia racconta una storia. Noi la progettiamo per essere impossibile da dimenticare."
        />
        <ServiceCategory
          number="04"
          title="Social Media Design"
          labels={['User Interface', 'User Experience', 'Progettazione']}
          paragraph="Ogni interfaccia racconta una storia. Noi la progettiamo per essere impossibile da dimenticare."
        />
      </div>
    </section>
  );
}
