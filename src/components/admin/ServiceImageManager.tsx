'use client';

import React, { useState, useEffect } from 'react';
import { useServiceCategories, ServiceCategory } from '@/hooks/useServiceCategories';
import { useProjects, Project } from '@/hooks/useProjects';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';

interface ServiceImageManagerProps {
  className?: string;
}

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorySlug: string;
  categoryName: string;
  availableProjects: Project[];
  selectedProjectIds: string[];
  onProjectToggle: (projectId: string) => void;
  getProjectAssignments: (projectId: string) => string[];
  getCategoryName: (slug: string) => string;
}

// Componente per il popup di selezione progetti
function ProjectSelectionModal({
  isOpen,
  onClose,
  categorySlug,
  categoryName,
  availableProjects,
  selectedProjectIds,
  onProjectToggle,
  getProjectAssignments,
  getCategoryName,
}: ProjectSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#0b0b0b] border border-neutral-200 dark:border-neutral-700 rounded-[25px] p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-figtree font-medium text-black dark:text-white">
              Seleziona Progetti per {categoryName}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
              Progetti selezionati: {selectedProjectIds.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progetti disponibili */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableProjects.length > 0 ? (
            availableProjects.map((project) => {
              const isSelected = selectedProjectIds.includes(project.id);
              const projectAssignments = getProjectAssignments(project.id);
              const isAssignedElsewhere = projectAssignments.length > 0 && !isSelected;

              return (
                <div
                  key={project.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#F20352] bg-[#F20352]/5'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-[#F20352]/50'
                  }`}
                  onClick={() => {
                    onProjectToggle(project.id);
                  }}
                >
                  {/* Checkbox */}
                  <div className="absolute top-3 right-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#F20352] bg-[#F20352]'
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Indicatore progetti già assegnati */}
                  {isAssignedElsewhere && (
                    <div className="absolute top-3 left-3">
                      <div className="flex gap-1">
                        {projectAssignments
                          .slice(0, 2)
                          .map((categorySlug: string, index: number) => (
                            <div
                              key={categorySlug}
                              className="w-2 h-2 bg-orange-500 rounded-full"
                              title={`Assegnato a ${getCategoryName(categorySlug)}`}
                            />
                          ))}
                        {projectAssignments.length > 2 && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-[6px] text-white font-bold">+</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Immagine progetto */}
                  <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info progetto */}
                  <div>
                    <h4 className="font-medium text-sm text-black dark:text-white mb-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {project.categories.join(', ')}
                    </p>
                    {isAssignedElsewhere && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        Assegnato a {projectAssignments.length} categoria
                        {projectAssignments.length > 1 ? 'e' : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-600 dark:text-neutral-400">
                Nessun progetto disponibile per questa categoria
              </p>
            </div>
          )}
        </div>

        {/* Messaggio se non ci sono progetti */}
        {availableProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-600 dark:text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">Nessun progetto disponibile</p>
            <p className="text-xs mt-1">Crea prima dei progetti nella sezione Projects</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-lg transition-colors duration-300"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceImageManager({ className = '' }: ServiceImageManagerProps) {
  const { t } = useTranslation();
  const {
    serviceCategories,
    loading,
    error,
    fetchServiceCategories,
    updateServiceCategoryImages,
    initializeServiceCategories,
    setError,
  } = useServiceCategories();
  const { projects, fetchProjects } = useProjects();

  // Stati locali per le modifiche non salvate
  const [localChanges, setLocalChanges] = useState<{
    [slug: string]: string[];
  }>({});

  // Stato per il popup di selezione progetti
  const [selectionModal, setSelectionModal] = useState<{
    isOpen: boolean;
    categorySlug: string;
    categoryName: string;
  }>({
    isOpen: false,
    categorySlug: '',
    categoryName: '',
  });

  // Carica le categorie di servizi e i progetti all'avvio
  useEffect(() => {
    fetchServiceCategories();
    fetchProjects();
  }, [fetchServiceCategories, fetchProjects]);

  // Inizializza le modifiche locali quando le categorie vengono caricate
  useEffect(() => {
    if (serviceCategories.length > 0) {
      const initialChanges: { [slug: string]: string[] } = {};
      serviceCategories.forEach((category) => {
        initialChanges[category.slug] = [...category.images];
      });
      setLocalChanges(initialChanges);
    }
  }, [serviceCategories]);

  // Gestisce la selezione/deselezione di un progetto per una categoria
  const handleProjectToggle = (categorySlug: string, projectId: string) => {
    setLocalChanges((prev) => {
      const currentImages = prev[categorySlug] || [];
      const isSelected = currentImages.includes(projectId);

      if (isSelected) {
        // Rimuovi il progetto
        return {
          ...prev,
          [categorySlug]: currentImages.filter((id) => id !== projectId),
        };
      } else {
        // Aggiungi il progetto (senza limite)
        return {
          ...prev,
          [categorySlug]: [...currentImages, projectId],
        };
      }
    });
  };

  // Salva le modifiche per una categoria specifica
  const saveCategoryChanges = async (categorySlug: string) => {
    try {
      const images = localChanges[categorySlug] || [];
      await updateServiceCategoryImages(categorySlug, images);
    } catch (error) {
      console.error('Error saving category changes:', error);
    }
  };

  // Salva tutte le modifiche
  const saveAllChanges = async () => {
    try {
      const promises = Object.keys(localChanges).map((slug) =>
        updateServiceCategoryImages(slug, localChanges[slug] || [])
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving all changes:', error);
    }
  };

  // Verifica se ci sono modifiche non salvate
  const hasUnsavedChanges = () => {
    return Object.keys(localChanges).some((slug) => {
      const originalImages = serviceCategories.find((c) => c.slug === slug)?.images || [];
      const currentImages = localChanges[slug] || [];
      return JSON.stringify(originalImages.sort()) !== JSON.stringify(currentImages.sort());
    });
  };

  // Ottiene i progetti selezionati per una categoria
  const getSelectedProjects = (categorySlug: string): Project[] => {
    const selectedIds = localChanges[categorySlug] || [];
    return projects.filter((project) => selectedIds.includes(project.id));
  };

  // Ottiene i progetti disponibili per una categoria (tutti i progetti, con indicatori per quelli già assegnati)
  const getAvailableProjects = (categorySlug: string): Project[] => {
    // Mostra tutti i progetti, non solo quelli non assegnati
    return projects;
  };

  // Ottiene i progetti già assegnati a questa categoria
  const getSelectedProjectsForCategory = (categorySlug: string): string[] => {
    return localChanges[categorySlug] || [];
  };

  // Ottiene tutte le categorie dove un progetto è assegnato
  const getProjectAssignments = (projectId: string): string[] => {
    const assignments: string[] = [];
    Object.keys(localChanges).forEach((categorySlug) => {
      if (localChanges[categorySlug].includes(projectId)) {
        assignments.push(categorySlug);
      }
    });
    return assignments;
  };

  // Ottiene il nome della categoria dal file di traduzione
  const getCategoryName = (slug: string): string => {
    const categoryMap: { [key: string]: string } = {
      'ui-ux-design': 'UI/UX Design',
      'project-management': 'Project Management',
      advertising: 'Advertising',
      'social-media-design': 'Social Media Design',
    };
    return categoryMap[slug] || slug;
  };

  // Apre il popup di selezione progetti
  const openProjectSelection = (categorySlug: string, categoryName: string) => {
    setSelectionModal({
      isOpen: true,
      categorySlug,
      categoryName,
    });
  };

  // Chiude il popup di selezione progetti
  const closeProjectSelection = () => {
    setSelectionModal({
      isOpen: false,
      categorySlug: '',
      categoryName: '',
    });
  };

  // Categorie di default se non sono ancora caricate dal database
  const defaultCategories = [
    { slug: 'ui-ux-design', name: 'UI/UX Design', images: [] },
    { slug: 'project-management', name: 'Project Management', images: [] },
    { slug: 'advertising', name: 'Advertising', images: [] },
    { slug: 'social-media-design', name: 'Social Media Design', images: [] },
  ];

  // Usa le categorie dal database se disponibili, altrimenti quelle di default
  const categoriesToShow = serviceCategories.length > 0 ? serviceCategories : defaultCategories;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352]"></div>
        <span className="ml-3 text-neutral-600 dark:text-neutral-400">
          Caricamento categorie servizi...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 dark:text-red-200 text-sm font-medium">
              Errore nel caricamento delle categorie
            </p>
            <p className="text-red-600 dark:text-red-300 text-xs mt-1">{error}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setError(null);
                fetchServiceCategories();
              }}
              className="text-red-600 hover:text-red-700 text-xs px-3 py-1 border border-red-300 rounded hover:bg-red-50"
            >
              Riprova
            </button>
            <button
              onClick={() => {
                setError(null);
                initializeServiceCategories();
              }}
              className="text-red-600 hover:text-red-700 text-xs px-3 py-1 border border-red-300 rounded hover:bg-red-50"
            >
              Inizializza
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <AnimatedText
            as="h2"
            className="text-xl font-figtree font-medium text-black dark:text-white"
          >
            Gestione Immagini Servizi
          </AnimatedText>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Seleziona fino a 3 progetti per ogni categoria di servizio
          </p>
        </div>

        <div className="flex gap-2">
          {serviceCategories.length === 0 && (
            <button
              onClick={() => initializeServiceCategories()}
              className="px-4 py-2 bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Inizializza Categorie
            </button>
          )}

          {hasUnsavedChanges() && (
            <button
              onClick={saveAllChanges}
              className="px-4 py-2 bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Salva Tutte le Modifiche
            </button>
          )}
        </div>
      </div>

      {/* Categorie di servizi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoriesToShow.map((category) => {
          const selectedProjects = getSelectedProjects(category.slug);
          const availableProjects = getAvailableProjects(category.slug);
          const hasChanges =
            JSON.stringify(category.images?.sort() || []) !==
            JSON.stringify((localChanges[category.slug] || []).sort());

          return (
            <div
              key={category.slug}
              className="bg-white dark:bg-[#0b0b0b] border border-neutral-200 dark:border-neutral-700 rounded-[25px] p-6 shadow-md"
            >
              {/* Header categoria */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white">
                    {getCategoryName(category.slug)}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedProjects.length} progetti selezionati
                  </p>
                </div>

                <div className="flex gap-2">
                  {hasChanges && (
                    <button
                      onClick={() => saveCategoryChanges(category.slug)}
                      className="px-3 py-1.5 text-xs bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg transition-all duration-300"
                    >
                      Salva
                    </button>
                  )}

                  <button
                    onClick={() =>
                      openProjectSelection(category.slug, getCategoryName(category.slug))
                    }
                    className="px-3 py-1.5 text-xs bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg transition-all duration-300 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Seleziona
                  </button>
                </div>
              </div>

              {/* Progetti selezionati */}
              {selectedProjects.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto">
                  {selectedProjects.map((project) => (
                    <div key={project.id} className="relative group flex-shrink-0">
                      <div className="w-[185px] h-[115px] bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Overlay con titolo e pulsante rimuovi */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <p className="text-xs font-medium mb-1">{project.title}</p>
                          <button
                            onClick={() => handleProjectToggle(category.slug, project.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-neutral-600 dark:text-neutral-400">
                  <p className="text-sm">Nessun progetto selezionato</p>
                  <p className="text-xs mt-1">
                    Clicca &quot;Seleziona&quot; per aggiungere progetti
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup di selezione progetti */}
      <ProjectSelectionModal
        isOpen={selectionModal.isOpen}
        onClose={closeProjectSelection}
        categorySlug={selectionModal.categorySlug}
        categoryName={selectionModal.categoryName}
        availableProjects={getAvailableProjects(selectionModal.categorySlug)}
        selectedProjectIds={localChanges[selectionModal.categorySlug] || []}
        onProjectToggle={(projectId) => handleProjectToggle(selectionModal.categorySlug, projectId)}
        getProjectAssignments={getProjectAssignments}
        getCategoryName={getCategoryName}
      />
    </div>
  );
}
