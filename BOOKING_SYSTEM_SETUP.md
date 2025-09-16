# Sistema di Booking con Resend

## 📋 Panoramica

Il sistema di booking è stato implementato con successo utilizzando Resend per la gestione delle email. Il sistema include:

- **Form multistep popup** per la raccolta dati clienti
- **Email automatiche** per cliente e admin
- **Gestione database** per salvare le richieste
- **Interfaccia admin** per visualizzare e gestire i booking

## 🗄️ Database Setup

### 1. Crea la tabella bookings

Esegui questo SQL su Supabase:

```sql
-- Crea la tabella bookings per gestire le richieste del form multistep
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "surname" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "contact_method" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggiungi un indice per le ricerche per email
CREATE INDEX IF NOT EXISTS "idx_bookings_email" ON "bookings" ("email");

-- Aggiungi un indice per le ricerche per data
CREATE INDEX IF NOT EXISTS "idx_bookings_created_at" ON "bookings" ("created_at");
```

## 📧 Configurazione Email

### 1. Variabili d'ambiente

Assicurati di avere queste variabili nel tuo `.env.local`:

```env
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Domini email

Le email vengono inviate da:

- **From**: `Webble Studio <noreply@contacts.webblestudio.com>`
- **To Cliente**: Email del cliente che compila il form
- **To Admin**: `info@webblestudio.com`

## 🚀 Funzionalità Implementate

### 1. Form Multistep Popup

- **6 step** per raccogliere tutti i dati necessari
- **Validazione** in tempo reale
- **Animazioni** fluide tra gli step
- **Responsive** per tutti i dispositivi

### 2. Email Automatiche

#### Email Cliente (`BookingClientEmail.tsx`)

- **Conferma ricezione** della richiesta
- **Dettagli** della richiesta inviata
- **Informazioni** sui prossimi passi
- **Design** professionale e responsive

#### Email Admin (`BookingAdminEmail.tsx`)

- **Notifica** di nuova richiesta
- **Dettagli completi** del cliente
- **Pulsanti rapidi** per rispondere
- **Informazioni** sul metodo di contatto preferito

### 3. Gestione Database

- **Salvataggio automatico** delle richieste
- **Validazione** dei dati
- **Gestione errori** completa
- **Indici** per performance ottimali

### 4. Interfaccia Admin

- **Visualizzazione** di tutti i booking
- **Filtri** per servizio e data
- **Azioni rapide** per contattare i clienti
- **Modal dettagli** per informazioni complete

## 📁 File Creati/Modificati

### Nuovi File

- `src/app/api/booking/route.ts` - API per creare booking
- `src/app/api/bookings/route.ts` - API per recuperare booking
- `src/components/email/BookingClientEmail.tsx` - Template email cliente
- `src/components/email/BookingAdminEmail.tsx` - Template email admin
- `src/hooks/useBookings.ts` - Hook per gestire booking
- `src/components/admin/BookingManager.tsx` - Componente admin
- `scripts/create-bookings-table.sql` - SQL per creare tabella

### File Modificati

- `src/components/ui/BookingForm.tsx` - Integrazione con API
- `src/app/admin/page.tsx` - Aggiunta sezione booking
- `src/hooks/index.ts` - Export del nuovo hook

## 🔧 Come Usare

### 1. Per i Clienti

1. Clicca sul pulsante "Contattaci" nel sito
2. Compila il form multistep (6 step)
3. Ricevi email di conferma automatica
4. Aspetta la risposta del team

### 2. Per l'Admin

1. Accedi alla pagina admin
2. Vai alla sezione "Booking"
3. Visualizza tutte le richieste
4. Usa i pulsanti rapidi per contattare i clienti
5. Clicca "Dettagli" per informazioni complete

## 🎯 Vantaggi del Sistema

### ✅ **Per i Clienti**

- **Esperienza fluida** con form multistep
- **Conferma immediata** via email
- **Informazioni chiare** sui prossimi passi
- **Design professionale** e responsive

### ✅ **Per l'Admin**

- **Notifiche automatiche** per nuove richieste
- **Gestione centralizzata** di tutti i booking
- **Azioni rapide** per contattare i clienti
- **Tracciamento completo** delle richieste

### ✅ **Tecnico**

- **Resend** per email affidabili
- **Supabase** per database scalabile
- **Validazione** completa dei dati
- **Gestione errori** robusta
- **Performance** ottimizzate

## 🔄 Flusso Completo

1. **Cliente** compila il form multistep
2. **Sistema** valida i dati
3. **Database** salva la richiesta
4. **Resend** invia email al cliente
5. **Resend** invia email all'admin
6. **Admin** visualizza la richiesta
7. **Admin** contatta il cliente
8. **Processo** completato

## 🛠️ Manutenzione

### Monitoraggio

- Controlla i log di Resend per email fallite
- Monitora il database per errori di salvataggio
- Verifica le performance dell'API

### Aggiornamenti

- I template email possono essere modificati facilmente
- La validazione del form può essere estesa
- Nuovi campi possono essere aggiunti al database

## 📞 Supporto

Per problemi o domande:

- Controlla i log del server
- Verifica le variabili d'ambiente
- Testa l'API con Postman/curl
- Controlla la configurazione di Resend

---

**Sistema implementato con successo! 🎉**

Il form multistep popup ora invia automaticamente email sia al cliente che all'admin utilizzando Resend, mantenendo un'esperienza utente fluida e professionale.
