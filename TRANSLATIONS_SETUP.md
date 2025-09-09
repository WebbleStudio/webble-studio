# Setup Traduzioni Progetti - Admin Dashboard

## Panoramica

Questo documento descrive l'implementazione del sistema di traduzioni per i progetti nell'admin dashboard, permettendo di gestire titoli e descrizioni in italiano e inglese.

## Modifiche Implementate

### 1. Database Schema

Aggiunte due nuove colonne alla tabella `projects`:

- `title_en`: Titolo del progetto in inglese
- `description_en`: Descrizione del progetto in inglese

**Script SQL per aggiornare il database:**

```sql
-- Esegui questo script nel database Supabase
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT;
```

### 2. Interfacce TypeScript

Aggiornate le interfacce per supportare i nuovi campi:

- `Project`: Aggiunti `title_en?` e `description_en?`
- `CreateProjectData`: Aggiunti i campi opzionali per le traduzioni

### 3. API Endpoints

Aggiornati gli endpoint per gestire i nuovi campi:

- `POST /api/projects`: Crea progetto con traduzioni
- `PUT /api/projects/[id]`: Aggiorna progetto con traduzioni
- `POST /api/projects/batch`: Inserimento batch con traduzioni

### 4. Admin Dashboard

#### Form di Creazione Progetto

- **Titolo (IT)**: Campo obbligatorio per il titolo in italiano
- **Titolo (EN)**: Campo opzionale per il titolo in inglese
- **Descrizione (IT)**: Campo obbligatorio per la descrizione in italiano
- **Descrizione (EN)**: Campo opzionale per la descrizione in inglese

#### Modale di Editing

- Supporta la modifica di tutti i campi di traduzione
- Mantiene la compatibilità con i progetti esistenti

#### Visualizzazione Progetti

- Mostra il titolo principale (IT) in evidenza
- Mostra il titolo in inglese (se presente) sotto in grigio
- Mantiene la compatibilità con i progetti senza traduzioni

### 5. File di Traduzione

Aggiunte traduzioni per l'admin dashboard in:

- `src/locales/it/common.json`
- `src/locales/en/common.json`

## Utilizzo

### Creazione Nuovo Progetto

1. Compila il titolo e la descrizione in italiano (obbligatori)
2. Opzionalmente, compila i campi in inglese
3. Seleziona le categorie
4. Carica l'immagine
5. Salva il progetto

### Editing Progetto Esistente

1. Clicca su "Edit" nel progetto
2. Modifica i campi in italiano e/o inglese
3. Salva le modifiche

### Visualizzazione

- I progetti mostrano sempre il titolo in italiano
- Se presente, il titolo in inglese viene mostrato sotto in grigio
- Le descrizioni in inglese sono disponibili per l'uso nel frontend

## Compatibilità

- **Progetti Esistenti**: Continuano a funzionare normalmente
- **Nuovi Progetti**: Possono avere traduzioni complete o parziali
- **Fallback**: Se manca una traduzione, viene usato il testo in italiano

## Frontend Integration

Per utilizzare le traduzioni nel frontend del portfolio:

```typescript
// Esempio di utilizzo con useTranslation
const { currentLanguage } = useTranslation();

const getProjectTitle = (project: Project) => {
  if (currentLanguage === 'en' && project.title_en) {
    return project.title_en;
  }
  return project.title; // Fallback su italiano
};

const getProjectDescription = (project: Project) => {
  if (currentLanguage === 'en' && project.description_en) {
    return project.description_en;
  }
  return project.description; // Fallback su italiano
};
```

## Note Tecniche

- I campi di traduzione sono opzionali (`nullable`)
- Se non specificati, vengono salvati come `null` nel database
- L'API gestisce correttamente i campi vuoti
- Il sistema è retrocompatibile con i progetti esistenti

## Prossimi Passi

1. Eseguire lo script SQL nel database Supabase
2. Testare la creazione di progetti con traduzioni
3. Testare l'editing di progetti esistenti
4. Integrare le traduzioni nel frontend del portfolio
5. Aggiungere validazione per i campi di traduzione (opzionale)
