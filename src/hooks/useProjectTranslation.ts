import { useTranslation } from './useTranslation';

export interface TranslatableProject {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  [key: string]: any; // Per permettere altre proprietà del progetto
}

export const useProjectTranslation = () => {
  const { currentLanguage } = useTranslation();

  const getTranslatedProject = (project: TranslatableProject) => {
    if (!project) return project;

    const isEnglish = currentLanguage === 'en';

    return {
      ...project,
      title: isEnglish && project.title_en ? project.title_en : project.title,
      description:
        isEnglish && project.description_en ? project.description_en : project.description,
    };
  };

  const getTranslatedTitle = (project: TranslatableProject) => {
    if (!project || !project.title) return '';

    const isEnglish = currentLanguage === 'en';
    return isEnglish && project.title_en ? project.title_en : project.title;
  };

  const getTranslatedDescription = (project: TranslatableProject) => {
    if (!project || !project.description) return '';

    const isEnglish = currentLanguage === 'en';
    return isEnglish && project.description_en ? project.description_en : project.description;
  };

  return {
    getTranslatedProject,
    getTranslatedTitle,
    getTranslatedDescription,
    currentLanguage,
  };
};
