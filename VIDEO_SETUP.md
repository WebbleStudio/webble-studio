# 🎥 Configurazione Video

## Problema Attuale

Il progetto cerca il file `1080p.mp4` nel bucket Supabase `videos`, ma il file non esiste ancora.

## Soluzioni

### Opzione 1: Carica il Video in Supabase (Raccomandato)

1. **Vai al Dashboard Supabase**
   - Accedi al tuo progetto Supabase
   - Vai su "Storage" nel menu laterale

2. **Crea il bucket `videos`** (se non esiste)
   - Clicca "New bucket"
   - Nome: `videos`
   - Pubblica: ✅ (per permettere accesso pubblico)

3. **Carica il file video**
   - Clicca sul bucket `videos`
   - Clicca "Upload file"
   - Carica il file `1080p.mp4`
   - Assicurati che il nome sia esattamente `1080p.mp4`

### Opzione 2: Usa un Video di Test

Se non hai un video, puoi:

1. **Scarica un video di test** da:
   - [Pexels](https://www.pexels.com/videos/)
   - [Pixabay](https://pixabay.com/videos/)
   - [Unsplash](https://unsplash.com/s/photos/video)

2. **Rinominalo in `1080p.mp4`**

3. **Caricalo nel bucket Supabase**

### Opzione 3: Modifica il Codice

Se vuoi usare un video diverso:

1. **Modifica il nome del file** in `src/components/sections/Home/KeyPoints.tsx`:

   ```tsx
   src={getPublicVideoUrl('tuo-video.mp4')}
   ```

2. **Aggiorna la lista** in `src/lib/video.ts`:
   ```ts
   export const AVAILABLE_VIDEOS = ['tuo-video.mp4'] as const;
   ```

## File Video Supportati

- **Formati**: `.mp4`, `.webm`, `.mov`
- **Risoluzioni consigliate**: 1080p, 720p
- **Dimensioni**: Ottimizza per il web (max 10MB)

## Configurazione Bucket

Il bucket `videos` deve essere:

- ✅ **Pubblico** (per accesso diretto)
- ✅ **Con policy RLS** (se necessario)

## Troubleshooting

### "Video file not found"

- ✅ Verifica che il file esista nel bucket `videos`
- ✅ Controlla il nome esatto del file
- ✅ Assicurati che il bucket sia pubblico

### "Storage error"

- ✅ Verifica le credenziali Supabase
- ✅ Controlla che il bucket esista
- ✅ Verifica i permessi del bucket

## Note

- Il sistema ha un **fallback automatico** che mostra un placeholder se il video non esiste
- I video vengono **cachati** per 1 anno per performance ottimali
- Il sistema supporta **range requests** per streaming efficiente
