'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AnimatedText from '@/components/ui/AnimatedText';
import { useProjects, Project as ProjectType } from '@/hooks/useProjects';
import { useHeroProjects, HeroProjectConfig } from '@/hooks/useHeroProjects';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type LayoutMode = 'desktop' | 'tablet' | 'mobile';
type AdminSection = 'projects' | 'highlights';

const categories = ['Web Design', 'UI/UX', 'Branding', 'Project Management', 'Social Media'];

// Componente per progetti draggabili
interface SortableProjectProps {
  project: ProjectType;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (project: ProjectType) => void;
  className?: string;
}

function SortableProject({
  project,
  index,
  onDelete,
  onEdit,
  className = '',
}: SortableProjectProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Usa sempre aspect-video per uniformità su tutti i dispositivi
  const aspectRatio = 'aspect-video';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} relative group h-full`}
      {...attributes}
      {...listeners}
    >
      <div className="bg-bg-card border border-border-primary-20 rounded-[25px] overflow-hidden hover:border-[#F20352]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        <div
          className={`${aspectRatio} bg-border-primary-20 relative overflow-hidden flex-shrink-0`}
        >
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          {/* Numerazione elegante */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#F20352] to-[#D91848] text-white text-xs font-semibold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm">
            {index + 1}
          </div>

          {/* Pulsanti Edit e Delete */}
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Pulsante Edit */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="bg-black hover:bg-neutral-800 text-white h-8 px-3 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              title="Modifica progetto"
            >
              Edit
            </button>

            {/* Pulsante rimozione */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="bg-red-500/90 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              title="Elimina progetto"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-center min-h-[32px]">
          <h4 className="font-medium text-sm">{project.title}</h4>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject,
    reorderProjects,
    setError,
  } = useProjects();

  const {
    heroProjects,
    loading: heroLoading,
    error: heroError,
    fetchHeroProjects,
    saveHeroProjects,
    uploadImage,
    deleteImage,
    clearHeroProjects,
    setError: setHeroError,
  } = useHeroProjects();

  const [dragActive, setDragActive] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');
  const [activeSection, setActiveSection] = useState<AdminSection>('projects');
  // States per upload immagini
  const [uploadingImage, setUploadingImage] = useState<{ [key: string]: boolean }>({});

  // States per modale editing
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Refs per mantenere il focus
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  // State per modifiche locali non salvate (Highlights)
  const [localConfigs, setLocalConfigs] = useState<{
    [projectId: string]: {
      descriptions: string[];
      images: string[];
      backgroundImage: string;
      hasChanges: boolean;
    };
  }>({});

  // State per modifiche locali non salvate (Projects)
  const [localProjectsState, setLocalProjectsState] = useState<{
    projects: typeof projects;
    deletedProjects: string[];
    hasChanges: boolean;
  }>({
    projects: [],
    deletedProjects: [],
    hasChanges: false,
  });

  // Derive selected highlights from heroProjects
  const selectedHighlights = heroProjects.map((hp) => hp.project_id);
  const highlightConfigs = heroProjects.reduce(
    (acc, hp) => {
      acc[hp.project_id] = {
        descriptions: hp.descriptions,
        images: hp.images,
        backgroundImage: hp.background_image,
      };
      return acc;
    },
    {} as {
      [projectId: string]: { descriptions: string[]; images: string[]; backgroundImage: string };
    }
  );

  // Filtra progetti per mostrare solo quelli non selezionati come highlights
  const availableProjects = projects.filter((project) => !selectedHighlights.includes(project.id));
  const [newProject, setNewProject] = useState({
    title: '',
    categories: [] as string[],
    description: '',
    link: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurazione sensori drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler per fine drag & drop (solo aggiorna stato locale)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const currentProjects = localProjectsState.hasChanges
        ? localProjectsState.projects
        : projects;
      const oldIndex = currentProjects.findIndex((p) => p.id === active.id);
      const newIndex = currentProjects.findIndex((p) => p.id === over?.id);

      const reorderedItems = arrayMove(currentProjects, oldIndex, newIndex);

      setLocalProjectsState((prev) => ({
        ...prev,
        projects: reorderedItems,
        hasChanges: true,
      }));

      console.log('Projects reordered locally (not saved)');
    }
  };

  // Carica progetti all'avvio
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Mantieni il focus quando il modale si apre
  useEffect(() => {
    if (isEditModalOpen && titleInputRef.current) {
      // Piccolo delay per assicurarsi che il modale sia renderizzato
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isEditModalOpen]);

  // Inizializza stato locale quando i progetti cambiano
  useEffect(() => {
    if (projects.length > 0 && !localProjectsState.hasChanges) {
      setLocalProjectsState((prev) => ({
        ...prev,
        projects: [...projects],
      }));
    }
  }, [projects, localProjectsState.hasChanges]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      // Salva il file selezionato e crea preview
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      console.log('File selezionato:', file.name);
    } else {
      console.log("File non valido o non è un'immagine");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Nessun file selezionato');
      return;
    }

    if (!newProject.title || newProject.categories.length === 0) {
      alert('Compila titolo e almeno una categoria prima di caricare');
      return;
    }

    try {
      // Crea UN SINGOLO progetto con multiple categorie
      await createProject({
        title: newProject.title,
        categories: newProject.categories, // Invia tutte le categorie come array
        description: newProject.description,
        link: newProject.link || undefined,
        file: selectedFile,
      });

      // Reset form dopo successo
      setNewProject({ title: '', categories: [], description: '', link: '' });
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      console.log('Upload completato con successo!');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeProject = (id: string) => {
    const currentProjects = localProjectsState.hasChanges ? localProjectsState.projects : projects;
    const filteredProjects = currentProjects.filter((p) => p.id !== id);

    setLocalProjectsState((prev) => ({
      ...prev,
      projects: filteredProjects,
      deletedProjects: [...prev.deletedProjects, id],
      hasChanges: true,
    }));

    console.log('Project marked for deletion locally (not saved)');
  };

  // Funzioni per editing - stabilizzate con useCallback
  const openEditModal = useCallback((project: ProjectType) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProject(null);
  }, []);

  // Salva tutte le modifiche ai progetti
  const saveAllProjectChanges = async () => {
    if (!localProjectsState.hasChanges) return;

    try {
      // Prima elimina i progetti marcati per la cancellazione
      for (const projectId of localProjectsState.deletedProjects) {
        await deleteProject(projectId);
      }

      // Poi riordina i progetti rimanenti
      if (localProjectsState.projects.length > 0) {
        await reorderProjects(localProjectsState.projects);
      }

      // Reset dello stato locale
      setLocalProjectsState({
        projects: [],
        deletedProjects: [],
        hasChanges: false,
      });

      // Ricarica i progetti dal server per assicurarsi che tutto sia sincronizzato
      await fetchProjects();

      console.log('All project changes saved successfully');
    } catch (error) {
      console.error('Failed to save project changes:', error);
      setError('Errore nel salvare le modifiche ai progetti');
    }
  };

  // Gestione multi-selezione categorie
  const handleCategoryToggle = (category: string) => {
    setNewProject((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const clearAllCategories = () => {
    setNewProject((prev) => ({ ...prev, categories: [] }));
  };

  const selectAllCategories = () => {
    setNewProject((prev) => ({ ...prev, categories: [...categories] }));
  };

  // Carica hero projects all'avvio
  useEffect(() => {
    fetchHeroProjects();
  }, [fetchHeroProjects]);

  // Inizializza localConfigs quando cambiano gli heroProjects
  useEffect(() => {
    const newLocalConfigs: typeof localConfigs = {};
    heroProjects.forEach((hp) => {
      newLocalConfigs[hp.project_id] = {
        descriptions: [...hp.descriptions],
        images: [...hp.images],
        backgroundImage: hp.background_image,
        hasChanges: false,
      };
    });
    setLocalConfigs(newLocalConfigs);
  }, [heroProjects]);

  // Gestione Highlights
  const handleHighlightSelection = async (projectId: string) => {
    try {
      if (selectedHighlights.includes(projectId)) {
        // Rimuovi progetto
        const newConfigs = selectedHighlights
          .filter((id) => id !== projectId)
          .map((id) => {
            const config = highlightConfigs[id];
            return {
              projectId: id,
              descriptions: config.descriptions,
              images: config.images,
              backgroundImage: config.backgroundImage,
            };
          });
        await saveHeroProjects(newConfigs);
      } else if (selectedHighlights.length < 3) {
        // Aggiungi progetto (max 3)
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          const newConfig: HeroProjectConfig = {
            projectId,
            descriptions: ['', '', ''], // 3 descrizioni per 3 slide
            images: [project.image_url], // Inizia con l'immagine principale
            backgroundImage: project.image_url, // Usa l'immagine principale come sfondo di default
          };

          const existingConfigs = selectedHighlights.map((id) => {
            const config = highlightConfigs[id];
            return {
              projectId: id,
              descriptions: config.descriptions,
              images: config.images,
              backgroundImage: config.backgroundImage,
            };
          });

          await saveHeroProjects([...existingConfigs, newConfig]);

          // Inizializza il localConfig per il nuovo progetto
          setLocalConfigs((prev) => ({
            ...prev,
            [projectId]: {
              descriptions: newConfig.descriptions,
              images: newConfig.images,
              backgroundImage: newConfig.backgroundImage,
              hasChanges: false,
            },
          }));
        }
      }
    } catch (error) {
      console.error('Error updating highlight selection:', error);
    }
  };

  // Aggiorna le configurazioni locali (senza salvare)
  const updateLocalConfig = (
    projectId: string,
    field: 'descriptions' | 'images' | 'backgroundImage',
    value: any
  ) => {
    setLocalConfigs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
        hasChanges: true,
      },
    }));
  };

  // Salva tutte le configurazioni highlights (unica funzione di salvataggio)
  const saveAllChanges = async () => {
    // Se non ci sono progetti selezionati, non fare nulla
    if (selectedHighlights.length === 0) return;

    try {
      const updatedConfigs = selectedHighlights.map((id) => {
        const localConfig = localConfigs[id];
        // Usa i dati locali se disponibili, altrimenti quelli salvati
        const configData = localConfig || highlightConfigs[id];

        return {
          projectId: id,
          descriptions: configData.descriptions,
          images: configData.images,
          backgroundImage: configData.backgroundImage,
        };
      });

      await saveHeroProjects(updatedConfigs);

      // Marca tutti i progetti come salvati
      setLocalConfigs((prev) => {
        const newConfigs = { ...prev };
        selectedHighlights.forEach((id) => {
          if (newConfigs[id]) {
            newConfigs[id].hasChanges = false;
          }
        });
        return newConfigs;
      });
    } catch (error) {
      console.error('Error saving highlights:', error);
    }
  };

  // Gestione upload immagini
  const handleImageUpload = async (
    projectId: string,
    file: File,
    type: 'background' | 'navigation'
  ) => {
    const uploadKey = `${projectId}-${type}`;
    setUploadingImage((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const result = await uploadImage(file, type);

      if (type === 'background') {
        updateLocalConfig(projectId, 'backgroundImage', result.url);
      } else {
        // Recupera le immagini attuali dal localConfig se disponibile
        const existingLocalConfig = localConfigs[projectId];
        const currentImages = existingLocalConfig
          ? existingLocalConfig.images
          : highlightConfigs[projectId]?.images || [];
        updateLocalConfig(projectId, 'images', [...currentImages, result.url]);
      }

      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Usa tutti i progetti dal database
  const filteredProjects = localProjectsState.hasChanges ? localProjectsState.projects : projects;

  // Componente Scheletro per mostrare slot vuoti
  const ProjectSlot = ({ position, className = '' }: { position: number; className?: string }) => {
    // Usa sempre aspect-video per uniformità su tutti i dispositivi
    const aspectRatio = 'aspect-video';

    return (
      <div
        className={`bg-border-primary-20 rounded-[25px] border-2 border-dashed border-text-primary-60/50 hover:border-text-primary-60 transition-all duration-300 hover:bg-text-primary-60/5 h-full flex flex-col ${className}`}
      >
        <div
          className={`${aspectRatio} bg-text-primary-60/10 rounded-t-[23px] flex items-center justify-center relative flex-shrink-0`}
        >
          {/* Numerazione elegante per slot vuoti */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-text-primary-60/80 to-text-primary-60/60 text-white text-xs font-semibold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm">
            {position}
          </div>
          <div className="text-center text-text-primary-60">
            <div className="w-10 h-10 mx-auto mb-2 bg-text-primary-60/20 rounded-full flex items-center justify-center border-2 border-dashed border-text-primary-60/40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-xs font-medium">Slot disponibile</p>
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-center min-h-[32px]">
          <div className="h-3 bg-text-primary-60/20 rounded mb-1"></div>
          <div className="h-2 bg-text-primary-60/10 rounded w-2/3"></div>
        </div>
      </div>
    );
  };

  // Render del layout preview basato sulla modalità con drag & drop
  const renderLayoutPreview = () => {
    const minSlots = layoutMode === 'desktop' ? 7 : layoutMode === 'tablet' ? 6 : 4;
    // Mostra tutti i progetti esistenti oppure almeno i slot minimi
    const totalSlots = Math.max(minSlots, filteredProjects.length);

    switch (layoutMode) {
      case 'mobile':
        return (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: totalSlots }).map((_, index) => {
              const project = filteredProjects[index];
              return project ? (
                <SortableProject
                  key={project.id}
                  project={project}
                  index={index}
                  onDelete={removeProject}
                  onEdit={openEditModal}
                  className="h-full"
                />
              ) : (
                <ProjectSlot key={`slot-${index}`} position={index + 1} className="h-full" />
              );
            })}
          </div>
        );

      case 'tablet':
        return (
          <div className="space-y-4">
            {Array.from({ length: Math.ceil(totalSlots / 2) }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, colIndex) => {
                  const index = rowIndex * 2 + colIndex;
                  if (index >= totalSlots) return null;

                  const project = filteredProjects[index];
                  return project ? (
                    <SortableProject
                      key={project.id}
                      project={project}
                      index={index}
                      onDelete={removeProject}
                      onEdit={openEditModal}
                      className="h-full"
                    />
                  ) : (
                    <ProjectSlot key={`slot-${index}`} position={index + 1} className="h-full" />
                  );
                })}
              </div>
            ))}
          </div>
        );

      case 'desktop':
        return renderDesktopLayoutWithCyclicalPattern();

      default:
        return null;
    }
  };

  // Funzione per renderizzare il layout desktop con pattern ciclico (stesso del portfolio)
  const renderDesktopLayoutWithCyclicalPattern = () => {
    const rows = [];
    const projectsPerPattern = 7; // Pattern si ripete ogni 7 progetti
    const minSlots = 7;
    const totalSlots = Math.max(minSlots, filteredProjects.length);

    // Dividiamo i progetti in gruppi di 7
    for (let groupStart = 0; groupStart < totalSlots; groupStart += projectsPerPattern) {
      const currentGroupEnd = Math.min(groupStart + projectsPerPattern, totalSlots);
      const groupIndex = Math.floor(groupStart / projectsPerPattern);

      // Prima riga del gruppo: primi 2 progetti (se disponibili)
      if (groupStart < totalSlots) {
        const firstRowEnd = Math.min(groupStart + 2, currentGroupEnd);
        const firstRowProjects = [];
        for (let i = groupStart; i < firstRowEnd; i++) {
          firstRowProjects.push(i);
        }
        // Aggiungi slot vuoti se necessari per completare la riga
        while (firstRowProjects.length < 2 && groupStart < minSlots) {
          firstRowProjects.push(groupStart + firstRowProjects.length);
        }

        if (firstRowProjects.length > 0) {
          rows.push(
            <div key={`group-${groupIndex}-row-0`} className="grid grid-cols-2 gap-4">
              {firstRowProjects.map((index) => {
                const project = filteredProjects[index];
                return project ? (
                  <SortableProject
                    key={project.id}
                    project={project}
                    index={index}
                    onDelete={removeProject}
                    onEdit={openEditModal}
                    className="h-full"
                  />
                ) : (
                  <ProjectSlot key={`slot-${index}`} position={index + 1} className="h-full" />
                );
              })}
            </div>
          );
        }
      }

      // Seconda riga del gruppo: progetti 3-5 (se disponibili)
      if (groupStart + 2 < totalSlots) {
        const secondRowStart = groupStart + 2;
        const secondRowEnd = Math.min(groupStart + 5, currentGroupEnd);
        const secondRowProjects = [];
        for (let i = secondRowStart; i < secondRowEnd; i++) {
          secondRowProjects.push(i);
        }
        // Aggiungi slot vuoti se necessari per completare la riga
        while (secondRowProjects.length < 3 && secondRowStart < minSlots) {
          secondRowProjects.push(secondRowStart + secondRowProjects.length);
        }

        if (secondRowProjects.length > 0) {
          rows.push(
            <div key={`group-${groupIndex}-row-1`} className="grid grid-cols-3 gap-4">
              {secondRowProjects.map((index) => {
                const project = filteredProjects[index];
                return project ? (
                  <SortableProject
                    key={project.id}
                    project={project}
                    index={index}
                    onDelete={removeProject}
                    onEdit={openEditModal}
                    className="h-full"
                  />
                ) : (
                  <ProjectSlot key={`slot-${index}`} position={index + 1} className="h-full" />
                );
              })}
            </div>
          );
        }
      }

      // Terza riga del gruppo: progetti 6-7 (se disponibili)
      if (groupStart + 5 < totalSlots) {
        const thirdRowStart = groupStart + 5;
        const thirdRowEnd = Math.min(groupStart + 7, currentGroupEnd);
        const thirdRowProjects = [];
        for (let i = thirdRowStart; i < thirdRowEnd; i++) {
          thirdRowProjects.push(i);
        }
        // Aggiungi slot vuoti se necessari per completare la riga
        while (thirdRowProjects.length < 2 && thirdRowStart < minSlots) {
          thirdRowProjects.push(thirdRowStart + thirdRowProjects.length);
        }

        if (thirdRowProjects.length > 0) {
          rows.push(
            <div key={`group-${groupIndex}-row-2`} className="grid grid-cols-2 gap-4">
              {thirdRowProjects.map((index, rowIndex) => {
                const project = filteredProjects[index];
                return project ? (
                  <SortableProject
                    key={project.id}
                    project={project}
                    index={index}
                    onDelete={removeProject}
                    onEdit={openEditModal}
                    className="h-full"
                  />
                ) : (
                  <ProjectSlot key={`slot-${index}`} position={index + 1} className="h-full" />
                );
              })}
            </div>
          );
        }
      }
    }

    return <div className="space-y-6">{rows}</div>;
  };

  // Componente modale per editing progetto - memoizzato per evitare re-render
  const EditProjectModal = React.memo(function EditProjectModal() {
    // Stati interni al modale per evitare re-render
    const [internalFormData, setInternalFormData] = useState({
      title: '',
      description: '',
      categories: [] as string[],
      link: '',
    });
    const [internalImageFile, setInternalImageFile] = useState<File | null>(null);
    const [internalImagePreview, setInternalImagePreview] = useState<string | null>(null);

    // Inizializza i dati interni quando il modale si apre
    useEffect(() => {
      if (editingProject) {
        setInternalFormData({
          title: editingProject.title,
          description: editingProject.description,
          categories: [...editingProject.categories],
          link: editingProject.link || '',
        });
        setInternalImageFile(null);
        setInternalImagePreview(null);
      }
    }, [editingProject?.id]); // Solo quando cambia l'ID del progetto

    // Funzioni interne al modale
    const handleInternalCategoryToggle = (category: string) => {
      setInternalFormData((prev) => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      }));
    };

    const handleInternalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        setInternalImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setInternalImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleInternalSubmit = async () => {
      if (!editingProject) return;

      try {
        const updates: any = {
          title: internalFormData.title,
          description: internalFormData.description,
          categories: internalFormData.categories,
        };

        if (internalFormData.link) {
          updates.link = internalFormData.link;
        }

        // Se c'è una nuova immagine, la carica prima
        if (internalImageFile) {
          const formData = new FormData();
          formData.append('file', internalImageFile);

          const imageResponse = await fetch('/api/projects/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (!imageResponse.ok) {
            throw new Error('Failed to upload image');
          }

          const imageData = await imageResponse.json();
          updates.image_url = imageData.url;
        }

        await updateProject(editingProject.id, updates);
        closeEditModal();
      } catch (error) {
        console.error('Error updating project:', error);
        setError("Errore nell'aggiornamento del progetto");
      }
    };

    if (!isEditModalOpen || !editingProject) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEditModal} />

        {/* Modale */}
        <div className="relative bg-bg-card border border-border-primary-20 rounded-[25px] p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-figtree font-medium text-text-primary">
              Modifica Progetto
            </h3>
            <button
              onClick={closeEditModal}
              className="text-text-primary-60 hover:text-text-primary transition-colors"
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

          {/* Form - Layout orizzontale */}
          <div className="grid grid-cols-2 gap-6">
            {/* Colonna sinistra */}
            <div className="space-y-4">
              {/* Titolo */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Titolo</label>
                <input
                  type="text"
                  value={internalFormData.title}
                  onChange={(e) =>
                    setInternalFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors"
                  placeholder="Nome del progetto"
                  ref={titleInputRef}
                />
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">
                  Descrizione
                </label>
                <textarea
                  value={internalFormData.description}
                  onChange={(e) =>
                    setInternalFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors resize-none"
                  rows={4}
                  placeholder="Descrizione del progetto"
                  ref={descriptionInputRef}
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Link</label>
                <input
                  type="url"
                  value={internalFormData.link}
                  onChange={(e) =>
                    setInternalFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors"
                  placeholder="Link del progetto (opzionale)"
                  ref={linkInputRef}
                />
              </div>
            </div>

            {/* Colonna destra */}
            <div className="space-y-4">
              {/* Categorie */}
              <div>
                <label className="block text-sm font-medium mb-3 text-text-primary">
                  Categorie
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleInternalCategoryToggle(category)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        internalFormData.categories.includes(category)
                          ? 'border-[#F20352] bg-[#F20352]/5 text-[#F20352]'
                          : 'border-border-primary-20 hover:border-[#F20352]/50 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            internalFormData.categories.includes(category)
                              ? 'border-[#F20352] bg-[#F20352]'
                              : 'border-border-primary-20'
                          }`}
                        >
                          {internalFormData.categories.includes(category) && (
                            <svg
                              className="w-2 h-2 text-white"
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
                        <span className="font-medium text-sm">{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {internalFormData.categories.length > 0 && (
                  <div className="mt-3 p-3 bg-[#F20352]/5 rounded-lg">
                    <p className="text-sm text-[#F20352] font-medium">
                      {internalFormData.categories.length} categorie selezionate
                    </p>
                  </div>
                )}
              </div>

              {/* Immagine */}
              <div>
                <label className="block text-sm font-medium mb-3 text-text-primary">Immagine</label>
                <div className="space-y-4">
                  {/* Preview immagine attuale */}
                  <div className="relative w-full aspect-video bg-border-primary-20 rounded-lg overflow-hidden">
                    <img
                      src={internalImagePreview || editingProject.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload nuova immagine */}
                  <div className="border-2 border-dashed border-border-primary-20 rounded-lg p-4 text-center hover:border-[#F20352]/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInternalImageChange}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="w-8 h-8 mx-auto bg-[#F20352]/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-[#F20352]"
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
                        <p className="text-sm text-text-primary-60">
                          {internalImageFile
                            ? 'Nuova immagine selezionata'
                            : 'Clicca per cambiare immagine'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border-primary-20">
            <button
              onClick={closeEditModal}
              className="px-4 py-3 bg-transparent hover:bg-text-primary-60/10 text-text-primary-60 hover:text-text-primary border border-border-primary-20 hover:border-text-primary-60/30 rounded-lg transition-colors duration-300"
            >
              Annulla
            </button>
            <button
              onClick={handleInternalSubmit}
              disabled={
                loading || !internalFormData.title || internalFormData.categories.length === 0
              }
              className="px-4 py-3 bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? 'Salvando...' : 'Salva Modifiche'}
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="bg-bg-primary text-text-primary transition-colors duration-300">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border-primary-20 bg-bg-primary">
        <div className="max-w-[1650px] mx-auto px-5 md:px-[30px] py-8">
          <AnimatedText
            as="h1"
            className="text-3xl md:text-4xl font-figtree font-medium text-text-primary"
          >
            Admin Dashboard
          </AnimatedText>
          <AnimatedText as="p" className="text-text-primary-60 mt-2">
            Gestisci i progetti del portfolio e visualizza il layout
          </AnimatedText>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="fixed top-[108px] left-0 right-0 z-50 border-b border-border-primary-20 bg-bg-primary">
        <div className="max-w-[1650px] mx-auto px-5 md:px-[30px]">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeSection === 'projects'
                  ? 'border-[#F20352] text-[#F20352]'
                  : 'border-transparent text-text-primary-60 hover:text-text-primary hover:border-border-primary-20'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveSection('highlights')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeSection === 'highlights'
                  ? 'border-[#F20352] text-[#F20352]'
                  : 'border-transparent text-text-primary-60 hover:text-text-primary hover:border-border-primary-20'
              }`}
            >
              Highlights
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1650px] mx-auto px-5 md:px-[30px] py-8 pt-[180px] min-h-screen">
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Upload Section - Colonna sinistra sticky */}
            <div className="xl:col-span-1">
              <div
                className="bg-bg-card border border-border-primary-20 rounded-[25px] p-6 sticky top-[188px] z-10 max-h-[70vh] overflow-y-auto"
                style={{ position: 'sticky', top: '188px' }}
              >
                <AnimatedText as="h2" className="text-xl font-figtree font-medium mb-6">
                  Nuovo Progetto
                </AnimatedText>

                {/* Form Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titolo</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors"
                      placeholder="Nome del progetto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrizione</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors resize-none"
                      rows={3}
                      placeholder="Descrizione del progetto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Link</label>
                    <input
                      type="url"
                      value={newProject.link}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, link: e.target.value }))}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary focus:outline-none focus:border-[#F20352] transition-colors"
                      placeholder="Link del progetto (opzionale)"
                    />
                  </div>
                </div>

                {/* Categoria Selection Buttons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Categoria</label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllCategories}
                        className="text-xs px-3 py-1 bg-[#F20352]/10 text-[#F20352] rounded-full hover:bg-[#F20352]/20 transition-colors"
                      >
                        Tutti
                      </button>
                      <button
                        onClick={clearAllCategories}
                        className="text-xs px-3 py-1 bg-text-primary-60/10 text-text-primary-60 rounded-full hover:bg-text-primary-60/20 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                          newProject.categories.includes(category)
                            ? 'border-[#F20352] bg-[#F20352]/5 text-[#F20352]'
                            : 'border-border-primary-20 hover:border-[#F20352]/50 text-text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              newProject.categories.includes(category)
                                ? 'border-[#F20352] bg-[#F20352]'
                                : 'border-border-primary-20'
                            }`}
                          >
                            {newProject.categories.includes(category) && (
                              <svg
                                className="w-2 h-2 text-white"
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
                          <span
                            className={`font-medium text-sm ${newProject.categories.includes(category) ? 'text-[#F20352]' : 'text-text-primary'}`}
                          >
                            {category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {newProject.categories.length > 0 && (
                    <div className="mt-3 p-3 bg-[#F20352]/5 rounded-lg">
                      <p className="text-sm text-[#F20352] font-medium">
                        {newProject.categories.length} categorie selezionate
                      </p>
                      <p className="text-xs text-text-primary-60 mt-1">
                        Il progetto apparirà in tutte le categorie selezionate
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Layout Preview Section - Colonna centrale */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <AnimatedText as="h2" className="text-xl font-figtree font-medium">
                    Portfolio Layout Preview
                  </AnimatedText>
                  <p className="text-text-primary-60 text-sm mt-1">
                    Layout:{' '}
                    <span className="font-medium text-[#F20352] capitalize">{layoutMode}</span> -
                    Progetti: {filteredProjects.length}{' '}
                    {filteredProjects.length === 1 ? 'progetto' : 'progetti'}
                    {localProjectsState.hasChanges && (
                      <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        Non salvato
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open('/portfolio', '_blank')}
                    className="px-4 py-2 bg-transparent hover:bg-text-primary-60/10 text-text-primary-60 hover:text-text-primary text-sm font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 border border-border-primary-20 hover:border-text-primary-60/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Visualizza Portfolio
                  </button>
                  {localProjectsState.hasChanges && (
                    <button
                      onClick={saveAllProjectChanges}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg disabled:opacity-50 transition-all duration-300 relative flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {loading ? 'Salvando...' : 'Salva'}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-bg-card border border-border-primary-20 rounded-[25px] p-6">
                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352]"></div>
                    <span className="ml-3 text-text-primary-60">Caricamento...</span>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={() => setError(null)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <span className="sr-only">Chiudi</span>
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                {!loading && !error && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={(localProjectsState.hasChanges
                        ? localProjectsState.projects
                        : projects
                      ).map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {renderLayoutPreview()}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>

            {/* Layout Selector - Colonna destra sticky */}
            <div className="xl:col-span-1">
              <div
                className="bg-bg-card border border-border-primary-20 rounded-[25px] p-6 sticky top-[188px] z-10"
                style={{ position: 'sticky', top: '188px' }}
              >
                <h3 className="text-lg font-figtree font-medium mb-4">Layout Preview</h3>
                <p className="text-text-primary-60 text-sm mb-6">
                  Visualizza come i progetti appaiono nel portfolio
                </p>

                <div className="space-y-3">
                  {(['desktop', 'tablet', 'mobile'] as LayoutMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setLayoutMode(mode)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        layoutMode === mode
                          ? 'border-[#F20352] bg-[#F20352]/5 text-[#F20352]'
                          : 'border-border-primary-20 hover:border-[#F20352]/50 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${layoutMode === mode ? 'bg-[#F20352]' : 'bg-text-primary-60'}`}
                        />
                        <span className="font-medium capitalize">{mode}</span>
                        <span className="text-xs text-text-primary-60 ml-auto">
                          {mode === 'desktop'
                            ? 'Desktop Layout'
                            : mode === 'tablet'
                              ? '2 per riga'
                              : '1 per riga'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-figtree font-medium mb-4">Upload Immagine</h3>
                  <p className="text-text-primary-60 text-sm mb-6">
                    Carica l&apos;immagine del progetto
                  </p>

                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-[#F20352] bg-[#F20352]/5'
                        : 'border-border-primary-20 hover:border-[#F20352]/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    {/* Preview dell'immagine selezionata */}
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-48 rounded-lg object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setImagePreview(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                        {selectedFile && (
                          <div>
                            <p className="text-text-primary font-medium text-sm">
                              {selectedFile.name}
                            </p>
                            <p className="text-text-primary-60 text-xs">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto bg-[#F20352]/10 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-[#F20352]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">
                            Trascina un&apos;immagine qui
                          </p>
                          <p className="text-text-primary-60 text-sm mt-1">
                            o clicca per selezionare
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pulsante Upload */}
                  {selectedFile && (
                    <button
                      onClick={handleUpload}
                      disabled={loading || !newProject.title || newProject.categories.length === 0}
                      className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        loading || !newProject.title || newProject.categories.length === 0
                          ? 'bg-text-primary-60/20 text-text-primary-60 cursor-not-allowed'
                          : 'bg-[#F20352] hover:bg-[#F20352]/90 text-white'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Caricamento...
                        </div>
                      ) : (
                        'Carica progetto'
                      )}
                    </button>
                  )}

                  {!newProject.title || newProject.categories.length === 0 ? (
                    <p className="text-text-primary-60 text-sm mt-4 text-center">
                      {!selectedFile
                        ? 'Compila titolo e almeno una categoria prima di selezionare l&apos;immagine'
                        : "Compila titolo e almeno una categoria per abilitare l'upload"}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Highlights Section */}
        {activeSection === 'highlights' && (
          <div className="space-y-8 min-h-screen">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left: Project Selection - Colonna sinistra sticky */}
              <div className="xl:col-span-1">
                <div
                  className="bg-bg-card border border-border-primary-20 rounded-[25px] p-6 sticky top-[188px] z-10"
                  style={{ position: 'sticky', top: '188px' }}
                >
                  <h3 className="text-lg font-figtree font-medium mb-4">
                    Seleziona Progetti
                    <span className="text-sm text-text-primary-60 ml-2">
                      ({selectedHighlights.length}/3)
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {/* Progetti già selezionati */}
                    {selectedHighlights.map((projectId) => {
                      const project = projects.find((p) => p.id === projectId);
                      if (!project) return null;

                      return (
                        <div
                          key={project.id}
                          className="p-4 rounded-lg border-2 border-[#F20352] bg-[#F20352]/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border-2 border-[#F20352] bg-[#F20352] flex items-center justify-center">
                              <svg
                                className="w-2 h-2 text-white"
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
                            </div>
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{project.title}</h4>
                              <p className="text-xs text-text-primary-60">
                                {project.categories.join(', ')} • Pos.{' '}
                                {selectedHighlights.indexOf(projectId) + 1}
                              </p>
                            </div>
                            <button
                              onClick={() => handleHighlightSelection(project.id)}
                              className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-all duration-300 flex items-center gap-1"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Rimuovi
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Separatore se ci sono progetti selezionati */}
                    {selectedHighlights.length > 0 && availableProjects.length > 0 && (
                      <div className="border-t border-border-primary-20 my-4 pt-4">
                        <p className="text-xs text-text-primary-60 mb-3">Progetti disponibili:</p>
                      </div>
                    )}

                    {/* Progetti disponibili */}
                    {availableProjects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 border-border-primary-20 hover:border-[#F20352]/50 ${
                          selectedHighlights.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => {
                          if (selectedHighlights.length < 3) {
                            handleHighlightSelection(project.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border-2 border-border-primary-20 flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-text-primary-60"
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
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{project.title}</h4>
                            <p className="text-xs text-text-primary-60">
                              {project.categories.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Messaggio quando non ci sono progetti disponibili */}
                    {availableProjects.length === 0 && selectedHighlights.length < 3 && (
                      <div className="text-center py-8 text-text-primary-60">
                        <p className="text-sm">Nessun progetto disponibile</p>
                        <p className="text-xs mt-1">
                          Crea prima dei progetti nella sezione Projects
                        </p>
                      </div>
                    )}

                    {/* Messaggio quando hai raggiunto il limite */}
                    {selectedHighlights.length >= 3 && availableProjects.length > 0 && (
                      <div className="text-center py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          Limite raggiunto: massimo 3 progetti selezionabili
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Configuration for Selected Projects - Colonna centrale */}
              <div className="xl:col-span-2">
                <div className="bg-bg-card border border-border-primary-20 rounded-[25px] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-figtree font-medium">Configurazione Highlights</h3>
                    <div className="flex items-center gap-2">
                      {/* Pulsante Salva sempre visibile se ci sono progetti selezionati */}
                      {selectedHighlights.length > 0 && (
                        <button
                          onClick={saveAllChanges}
                          disabled={heroLoading}
                          className="px-4 py-2 text-sm bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg disabled:opacity-50 transition-all duration-300 relative flex items-center gap-2 shadow-sm"
                        >
                          {/* Indicatore modifiche non salvate */}
                          {Object.values(localConfigs).some((config) => config?.hasChanges) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full shadow-sm"></span>
                          )}
                          {heroLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Salvando...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              Salva
                            </>
                          )}
                        </button>
                      )}
                      {selectedHighlights.length > 0 && (
                        <button
                          onClick={clearHeroProjects}
                          disabled={heroLoading}
                          className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Elimina Tutto
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Error State */}
                  {heroError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                      <p className="text-red-700 dark:text-red-200 text-sm">Errore: {heroError}</p>
                      <button
                        onClick={() => setHeroError(null)}
                        className="text-red-600 hover:text-red-700 text-xs mt-2"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {heroLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F20352]"></div>
                      <span className="ml-3 text-text-primary-60 text-sm">Caricamento...</span>
                    </div>
                  )}

                  {selectedHighlights.length === 0 && !heroLoading ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-text-primary-60/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-text-primary-60"
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
                      <p className="text-text-primary-60">
                        Seleziona almeno un progetto per iniziare la configurazione
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {selectedHighlights.map((projectId, index) => {
                        const project = projects.find((p) => p.id === projectId);
                        const config = highlightConfigs[projectId];
                        const localConfig = localConfigs[projectId];
                        if (!project || !config) return null;

                        // Usa i dati locali se disponibili, altrimenti quelli salvati
                        const currentConfig = localConfig || {
                          descriptions: config.descriptions,
                          images: config.images,
                          backgroundImage: config.backgroundImage,
                          hasChanges: false,
                        };

                        return (
                          <div
                            key={projectId}
                            className="border border-border-primary-20 rounded-lg p-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#F20352] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium">{project.title}</h4>
                                  <p className="text-sm text-text-primary-60">
                                    {project.categories.join(', ')}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleHighlightSelection(projectId)}
                                className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Rimuovi
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Descriptions */}
                              <div>
                                <label className="block text-sm font-medium mb-3">
                                  Descrizioni Slides
                                </label>
                                <div className="space-y-3">
                                  {currentConfig.descriptions.map((desc, descIndex) => (
                                    <div key={descIndex}>
                                      <label className="block text-xs text-text-primary-60 mb-1">
                                        Slide {descIndex + 1}
                                      </label>
                                      <textarea
                                        value={desc}
                                        onChange={(e) => {
                                          const newDescriptions = [...currentConfig.descriptions];
                                          newDescriptions[descIndex] = e.target.value;
                                          updateLocalConfig(
                                            projectId,
                                            'descriptions',
                                            newDescriptions
                                          );
                                        }}
                                        className="w-full px-3 py-2 bg-bg-primary border border-border-primary-20 rounded-lg text-text-primary text-sm focus:outline-none focus:border-[#F20352] transition-colors resize-none"
                                        rows={2}
                                        placeholder={`Descrizione per slide ${descIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Background Image */}
                              <div>
                                <label className="block text-sm font-medium mb-3">
                                  Sfondo Container
                                </label>
                                <div className="space-y-3">
                                  <div className="relative w-full aspect-video bg-border-primary-20 rounded-lg overflow-hidden">
                                    <img
                                      src={currentConfig.backgroundImage}
                                      alt="Background preview"
                                      className="w-full h-full object-cover"
                                    />
                                    {uploadingImage[`${projectId}-background`] && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className="relative border-2 border-dashed border-border-primary-20 rounded-lg p-4 text-center hover:border-[#F20352]/50 transition-colors cursor-pointer"
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = async (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                          try {
                                            await handleImageUpload(projectId, file, 'background');
                                          } catch (error) {
                                            console.error('Upload failed:', error);
                                          }
                                        }
                                      };
                                      input.click();
                                    }}
                                  >
                                    <div className="flex items-center justify-center gap-2 text-text-primary-60">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                      </svg>
                                      <span className="text-sm">
                                        Carica nuova immagine di sfondo
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Images Navigation */}
                            <div className="mt-6">
                              <label className="block text-sm font-medium mb-3">
                                Immagini Navigazione
                                <span className="text-xs text-text-primary-60 ml-2">
                                  ({currentConfig.images.length} immagini)
                                </span>
                              </label>
                              <div className="flex gap-3 flex-wrap">
                                {currentConfig.images.map((imageUrl, imgIndex) => (
                                  <div key={imgIndex} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`Image ${imgIndex + 1}`}
                                      className="w-16 h-16 object-cover rounded-lg border border-border-primary-20"
                                    />
                                    <button
                                      onClick={() => {
                                        const newImages = currentConfig.images.filter(
                                          (_, i) => i !== imgIndex
                                        );
                                        updateLocalConfig(projectId, 'images', newImages);
                                      }}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-sm"
                                      title="Rimuovi immagine"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = async (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        try {
                                          await handleImageUpload(projectId, file, 'navigation');
                                        } catch (error) {
                                          console.error('Upload failed:', error);
                                        }
                                      }
                                    };
                                    input.click();
                                  }}
                                  className="w-16 h-16 border-2 border-dashed border-border-primary-20 rounded-lg flex items-center justify-center text-text-primary-60 hover:border-[#F20352] hover:text-[#F20352] transition-colors relative"
                                  disabled={uploadingImage[`${projectId}-navigation`]}
                                >
                                  {uploadingImage[`${projectId}-navigation`] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  ) : (
                                    <svg
                                      className="w-6 h-6"
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
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale di editing - Fuori dal componente principale per evitare re-render */}
      {isEditModalOpen && editingProject && <EditProjectModal />}
    </div>
  );
}
