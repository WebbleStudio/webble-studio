# 🛡️ Google reCAPTCHA v3 - Guida Configurazione

## 📋 **Prerequisiti**
- Account Google
- Dominio verificato

---

## **STEP 1: Creare chiavi reCAPTCHA**

### 1.1 Vai su Google reCAPTCHA Admin Console
- Apri: https://www.google.com/recaptcha/admin/create
- Accedi con il tuo account Google

### 1.2 Compila il form
```
Label: Webble Studio Contact Form
reCAPTCHA type: reCAPTCHA v3
Domains: 
  - webblestudio.com
  - localhost (per sviluppo)
```

### 1.3 Accetta i termini e clicca "Submit"

### 1.4 Copia le chiavi
Riceverai due chiavi:
- **Site Key** (chiave pubblica)
- **Secret Key** (chiave privata)

---

## **STEP 2: Configurare le variabili d'ambiente**

### 2.1 File `.env.local` (locale)
Crea o aggiorna il file `.env.local` nella root del progetto:

```env
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 2.2 Vercel (produzione)
1. Vai su **Vercel Dashboard**
2. Seleziona il progetto **Webble Studio**
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi le variabili:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY = your_site_key_here
   RECAPTCHA_SECRET_KEY = your_secret_key_here
   ```

---

## **STEP 3: Testare reCAPTCHA**

### 3.1 Sviluppo locale
```bash
npm run dev
```

### 3.2 Aprire il form di contatto
- Vai su: http://localhost:3000/#contact
- Compila il form
- Invia il messaggio

### 3.3 Verificare nei log
Dovresti vedere nel terminale:
```
✅ reCAPTCHA verificata con successo: { score: 0.9, action: 'contact_form' }
```

### 3.4 Controllare il punteggio
- **Score > 0.7**: Utente molto probabilmente umano
- **Score 0.5-0.7**: Utente probabilmente umano (threshold attuale)
- **Score < 0.5**: Possibile bot (bloccato)

---

## **STEP 4: Monitorare reCAPTCHA**

### 4.1 Dashboard Google reCAPTCHA
- Vai su: https://www.google.com/recaptcha/admin
- Seleziona il tuo sito
- Visualizza statistiche e metriche

### 4.2 Metriche da monitorare
- **Requests**: Numero di richieste totali
- **Score distribution**: Distribuzione dei punteggi
- **Actions**: Azioni più utilizzate

---

## **🎯 Come funziona**

### Frontend (Contact.tsx)
1. Utente compila il form
2. Al submit, viene generato un token reCAPTCHA
3. Token inviato insieme ai dati del form

### Backend (API route)
1. Riceve il token reCAPTCHA
2. Verifica il token con Google
3. Controlla il punteggio (score)
4. Se score > 0.5, procede con l'invio
5. Se score < 0.5, blocca la richiesta

---

## **⚙️ Configurazione avanzata**

### Modificare il threshold (soglia)
Nel file `src/app/api/contact/route.ts`:

```typescript
// Cambia 0.5 con il valore desiderato (0.0 - 1.0)
if (!recaptchaData.success || recaptchaData.score < 0.5) {
  // Blocca richiesta
}
```

**Threshold consigliati:**
- **0.3**: Molto permissivo (più falsi positivi)
- **0.5**: Bilanciato (consigliato)
- **0.7**: Molto restrittivo (più falsi negativi)

---

## **🔧 Troubleshooting**

### Errore: "Token reCAPTCHA mancante"
- Verifica che `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` sia configurata
- Riavvia il server di sviluppo

### Errore: "Verifica reCAPTCHA fallita"
- Verifica che `RECAPTCHA_SECRET_KEY` sia corretta
- Controlla che il dominio sia registrato su Google reCAPTCHA

### reCAPTCHA non carica
- Controlla la console del browser per errori
- Verifica che il dominio sia autorizzato

---

## **📊 Vantaggi di reCAPTCHA v3**

✅ **Invisibile**: Nessun CAPTCHA da risolvere per l'utente
✅ **Score-based**: Punteggio da 0.0 (bot) a 1.0 (umano)
✅ **Adaptive**: Si adatta al comportamento dell'utente
✅ **Privacy-friendly**: Conforme GDPR
✅ **Gratuito**: Fino a 1 milione di richieste/mese

---

## **🎉 Implementazione completata!**

Il tuo form di contatto ora è protetto da bot e spam con Google reCAPTCHA v3.

