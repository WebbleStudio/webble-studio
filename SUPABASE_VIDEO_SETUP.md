# 📹 Supabase Video Setup Guide

## 🎯 Problema Attuale

Il video nella homepage non si carica perché manca il file `1080p.mp4` nel bucket Supabase.

**Errore**: `{"error":"Video not found","availableFiles":[]}`

---

## ✅ Soluzione Passo-Passo

### **1. Accedi al Dashboard Supabase**

- Vai su https://app.supabase.com
- Seleziona il tuo progetto

### **2. Crea il Bucket "videos"**

```bash
Naviga a: Storage → Create a new bucket
Nome: videos
Public bucket: ✅ ABILITATO (importante!)
```

### **3. Carica il Video**

```bash
1. Clicca sul bucket "videos"
2. Upload file → Seleziona 1080p.mp4
3. Conferma upload
```

### **4. Verifica Impostazioni Bucket**

```bash
Bucket settings → videos
- Public: ✅ Deve essere abilitato
- File size limit: Aumenta se necessario (default 50MB)
```

### **5. Test Finale**

```bash
URL pubblico: https://[PROJECT].supabase.co/storage/v1/object/public/videos/1080p.mp4
Dovrebbe mostrare il video nel browser
```

---

## 🔧 Ottimizzazioni Video Raccomandate

### **Compressione Ottimale**

```bash
# Usa FFmpeg per ottimizzare il video prima dell'upload
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart 1080p.mp4
```

### **Dimensioni Raccomandate**

- **Risoluzione**: 1920x1080 (Full HD)
- **Bitrate**: 2-4 Mbps per buona qualità
- **Formato**: MP4 (H.264 + AAC)
- **Durata**: Keep it short per performance

### **Alternative Risoluzioni**

Puoi caricare anche:

- `720p.mp4` (1280x720) - Per mobile
- `480p.mp4` (854x480) - Per connessioni lente

---

## 🚀 Sistema di Cache Implementato

Una volta caricato il video, il nostro sistema automaticamente:

✅ **Cache 1 anno** nel browser  
✅ **Range requests** per streaming efficiente  
✅ **Lazy loading** intelligente  
✅ **Network-aware** optimization  
✅ **Fallback robusto** per errori

---

## 🐛 Troubleshooting

### **Errore 404 - Video not found**

- ✅ Controlla che il bucket "videos" esiste
- ✅ Controlla che il file si chiama esattamente `1080p.mp4`
- ✅ Verifica che il bucket sia pubblico

### **Errore 403 - Access denied**

```bash
1. Bucket settings → videos
2. Public bucket: ABILITA
3. RLS policies: Disabilita per bucket pubblici
```

### **Video non si riproduce**

- ✅ Formato video supportato (MP4/H.264)
- ✅ Codec audio compatibile (AAC)
- ✅ File non corrotto

### **Performance lenta**

- ✅ Comprimi il video (vedi sopra)
- ✅ Usa CDN Supabase (automatico)
- ✅ Riduci risoluzione se necessario

---

## 📊 Monitoring

### **Check Status**

```bash
# Test API endpoint
curl -I http://localhost:3002/api/video/1080p.mp4

# Dovrebbe restituire 200 o 206 (success)
# Non 404 (not found) o 500 (error)
```

### **Browser Console**

```javascript
// Debug video loading
document.querySelector('video').addEventListener('error', (e) => {
  console.error('Video error:', e);
});

// Check network optimization
console.log('Connection:', navigator.connection?.effectiveType);
```

---

## ✅ Checklist Completamento

- [ ] Bucket "videos" creato
- [ ] Bucket impostato come pubblico
- [ ] File 1080p.mp4 caricato
- [ ] URL pubblico accessibile
- [ ] Video si riproduce nella homepage
- [ ] Console priva di errori video
- [ ] Cache funziona (seconda visita istantanea)

---

## 🎯 Risultato Finale

Dopo aver completato questi passaggi:

- ✅ Video si carica velocemente
- ✅ Cache riduce 90%+ traffico Supabase
- ✅ Ottimizzazioni automatiche attive
- ✅ Fallback elegante per errori
- ✅ Performance ottimale su ogni device

**Tempo stimato setup**: 5-10 minuti 🚀
