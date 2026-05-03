# Booking System — Setup Guide

## Panoramica

Il sistema di prenotazione richiede 3 integrazioni:
1. **Google Calendar API** — per leggere disponibilità e creare eventi con Google Meet
2. **Resend** — per inviare email di conferma al cliente e notifica agli admin
3. **Variabili d'ambiente** — 6 variabili da aggiungere a `.env.local` e Vercel

---

## Step 1 — Google Cloud Console

### 1.1 Crea il progetto

1. Vai su [console.cloud.google.com](https://console.cloud.google.com)
2. Click su "Select a project" → "New Project"
3. Nome: `Webble Studio Booking` → Create

### 1.2 Abilita Google Calendar API

1. Menu → "APIs & Services" → "Library"
2. Cerca "Google Calendar API" → Enable

### 1.3 Crea le credenziali OAuth2

1. Menu → "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Se richiesto, configura la schermata di consenso:
   - User Type: **External**
   - App name: `Webble Studio Booking`
   - Email: la tua
   - Salva e continua (lascia tutto il resto vuoto)
4. Torna a "Create Credentials" → "OAuth client ID"
5. Application type: **Desktop app**
6. Nome: `Webble Booking`
7. Click Create → copia **Client ID** e **Client Secret**

---

## Step 2 — Ottieni il Refresh Token

Il refresh token permette al server di accedere al calendario senza interazione umana.

### Metodo: Google OAuth Playground

1. Vai su [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
2. Click sull'icona ⚙️ (settings) in alto a destra
3. Spunta **"Use your own OAuth credentials"**
4. Inserisci il tuo **Client ID** e **Client Secret**
5. Nel pannello sinistro, cerca e seleziona:
   ```
   https://www.googleapis.com/auth/calendar
   ```
6. Click "Authorize APIs" → accedi con il Google Account che contiene il calendario
7. Click "Exchange authorization code for tokens"
8. Copia il valore di **`refresh_token`**

> ⚠️ Il refresh token appare **una sola volta**. Salvalo subito.

---

## Step 3 — Ottieni il Calendar ID

1. Apri [calendar.google.com](https://calendar.google.com)
2. Nel pannello sinistro, trova il calendario su cui vuoi ricevere le prenotazioni
3. Click sui 3 puntini → **"Settings and sharing"**
4. Scorri fino a "Integrate calendar"
5. Copia l'**"Calendar ID"**:
   - Per il calendario principale è `primary`
   - Per calendari custom sarà tipo `abc123@group.calendar.google.com`

---

## Step 4 — Resend (email)

1. Vai su [resend.com](https://resend.com) → crea account gratuito
2. Dashboard → "API Keys" → "Create API Key"
3. Nome: `Webble Studio` → copia la chiave (inizia con `re_...`)
4. Vai su "Domains" → aggiungi il dominio `webble.studio`
5. Segui le istruzioni DNS per verificarlo
6. Una volta verificato, puoi inviare da `noreply@webble.studio`

> Il piano gratuito Resend è 3.000 email/mese — più che sufficiente.

---

## Step 5 — Variabili d'ambiente

### In `.env.local` (sviluppo locale)

```env
# Google Calendar
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALENDAR_ID=primary

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Webble Studio <noreply@webble.studio>
```

### Su Vercel (produzione)

1. Dashboard Vercel → il tuo progetto → **Settings** → **Environment Variables**
2. Aggiungi ogni variabile con scope **Production** (e Preview se vuoi)
3. Le stesse 6 variabili di sopra

---

## Step 6 — Finestre orarie (personalizzazione)

Le ore disponibili per le prenotazioni si modificano in `src/lib/google-calendar.ts`:

```ts
const WORK_WINDOWS = [
  { start: 10, end: 12 }, // 10:00–12:00
  { start: 15, end: 17 }, // 15:00–17:00
];
```

Modifica i valori numerici (ore in formato 24h) per adattarli alla tua disponibilità.

---

## Step 7 — Email admin (destinatari notifica)

In `src/lib/email.ts` aggiorna l'array con le email che devono ricevere la notifica di ogni prenotazione:

```ts
const ADMIN_EMAILS = ["webblestudio.com@gmail.com"];
```

Puoi aggiungere più email:
```ts
const ADMIN_EMAILS = ["info@webble.studio", "vadim@webble.studio"];
```

---

## Test locale

1. Avvia il dev server:
   ```bash
   npm run dev
   ```
2. Apri il sito e clicca "Prenota una call"
3. Seleziona tipo → data → orario → inserisci dati → invia
4. Verifica:
   - Evento creato su Google Calendar ✓
   - Email ricevuta al cliente ✓
   - Notifica ricevuta agli admin ✓
   - Link Google Meet funzionante ✓

---

## Troubleshooting

| Errore | Causa | Soluzione |
|--------|-------|-----------|
| `invalid_grant` | Refresh token scaduto o revocato | Ripeti Step 2 per generarne uno nuovo |
| `Calendar not found` | `GOOGLE_CALENDAR_ID` sbagliato | Verifica l'ID in Google Calendar Settings |
| Nessun slot disponibile | Finestre orarie occupate o date passate | Controlla il calendario e le `WORK_WINDOWS` |
| Email non arriva | Dominio Resend non verificato | Completa la verifica DNS su Resend |
| `401 Unauthorized` | `RESEND_API_KEY` mancante/errata | Verifica la chiave e le env vars su Vercel |
