# 🎯 Tutorial Google Tag Manager - Tracking Bottoni CTA

## 📌 Obiettivo
Tracciare i click sui bottoni:
- **"Prenota Call"** nella Hero Section
- **"Mettiamoci in Contatto"** nella Payoff Section

---

## 🔧 PARTE 1: Configurazione Google Tag Manager

### STEP 1: Accedi a Google Tag Manager

1. Vai su: https://tagmanager.google.com/
2. Seleziona il tuo **Container** (es: GTM-XXXXXXX)
3. Assicurati di essere in **Workspace** (non in una versione pubblicata)

---

### STEP 2: Crea il Trigger per i Click

#### 2.1 - Vai nella sezione Triggers
- Nel menu a sinistra, clicca **"Triggers"**
- Clicca il bottone rosso **"New"**

#### 2.2 - Configura il Trigger
```
Nome Trigger: CTA Click Tracking
Tipo: Click - All Elements
```

#### 2.3 - Configura quando attivarsi
Clicca su "Some Clicks" e imposta:
```
This trigger fires on: Some Clicks
Fire this trigger when an Event occurs and all of these conditions are true:

Click Element → matches CSS selector → [data-gtm-event="cta_click"]
```

#### 2.4 - Salva
- Clicca **"Save"** in alto a destra

---

### STEP 3: Crea le Variabili Custom

#### 3.1 - Vai nella sezione Variables
- Nel menu a sinistra, clicca **"Variables"**
- Scorri fino a **"User-Defined Variables"**
- Clicca **"New"**

#### 3.2 - Crea 3 variabili (ripeti per ognuna)

**VARIABILE 1: GTM Category**
```
Nome: GTM - Category
Tipo: DOM Element
Selection Method: CSS Selector
Element Selector: [data-gtm-event="cta_click"]
Attribute Name: data-gtm-category
```
✅ Salva

**VARIABILE 2: GTM Action**
```
Nome: GTM - Action
Tipo: DOM Element
Selection Method: CSS Selector
Element Selector: [data-gtm-event="cta_click"]
Attribute Name: data-gtm-action
```
✅ Salva

**VARIABILE 3: GTM Label**
```
Nome: GTM - Label
Tipo: DOM Element
Selection Method: CSS Selector
Element Selector: [data-gtm-event="cta_click"]
Attribute Name: data-gtm-label
```
✅ Salva

---

### STEP 4: Crea il Tag GA4 per tracciare i Click

#### 4.1 - Vai nella sezione Tags
- Nel menu a sinistra, clicca **"Tags"**
- Clicca il bottone rosso **"New"**

#### 4.2 - Configura il Tag
```
Nome Tag: GA4 - CTA Click Event
```

#### 4.3 - Tag Configuration
- Clicca su "Tag Configuration"
- Seleziona **"Google Analytics: GA4 Event"**

#### 4.4 - Inserisci i parametri
```
Measurement ID: G-XXXXXXXXXX
(Inserisci il tuo ID Google Analytics 4)

Event Name: cta_click

Event Parameters (clicca "Add Row" per ognuno):
┌────────────────────┬──────────────────────┐
│ Parameter Name     │ Value                │
├────────────────────┼──────────────────────┤
│ event_category     │ {{GTM - Category}}   │
│ event_action       │ {{GTM - Action}}     │
│ event_label        │ {{GTM - Label}}      │
└────────────────────┴──────────────────────┘
```

#### 4.5 - Triggering
- Clicca su "Triggering"
- Seleziona il trigger creato: **"CTA Click Tracking"**

#### 4.6 - Salva
- Clicca **"Save"** in alto a destra

---

## 🧪 PARTE 2: Testare il Tracking (IMPORTANTE!)

### STEP 5: Attiva la Modalità Preview

#### 5.1 - Avvia Preview
- In alto a destra in GTM, clicca **"Preview"**
- Si aprirà una nuova finestra "Tag Assistant"

#### 5.2 - Connetti al tuo sito
```
Your website's URL: https://webblestudio.com
(o il tuo dominio)
```
- Clicca **"Connect"**
- Si aprirà il tuo sito in una nuova tab

#### 5.3 - Testa i Click
Nel tuo sito:

**TEST 1 - Bottone Hero:**
1. Vai nella sezione Hero (in alto)
2. Clicca il bottone **"Prenota Call"**
3. Torna nella tab "Tag Assistant"

Dovresti vedere:
```
✅ Tags Fired:
   └─ GA4 - CTA Click Event

Event Parameters:
├─ event_category: engagement
├─ event_action: prenota_call
└─ event_label: hero_section (o hero_section_desktop)
```

**TEST 2 - Bottone Payoff:**
1. Scrolla fino alla sezione Payoff
2. Clicca il bottone **"Mettiamoci in Contatto"**
3. Torna nella tab "Tag Assistant"

Dovresti vedere:
```
✅ Tags Fired:
   └─ GA4 - CTA Click Event

Event Parameters:
├─ event_category: engagement
├─ event_action: mettiamoci_in_contatto
└─ event_label: payoff_section
```

#### 5.4 - Verifica che tutto funzioni
- ✅ Entrambi i click devono attivare il tag
- ✅ Le variabili devono avere i valori corretti
- ❌ Se qualcosa non funziona, controlla le variabili

---

## 📤 PARTE 3: Pubblicare le Modifiche

### STEP 6: Pubblica il Container GTM

#### 6.1 - Esci dalla Preview
- Chiudi la finestra "Tag Assistant"
- Torna al container GTM

#### 6.2 - Submit Changes
- In alto a destra, clicca **"Submit"**

#### 6.3 - Versione Info
```
Version Name: CTA Tracking - Hero & Payoff
Version Description: 
Aggiunto tracking per bottoni CTA:
- Prenota Call (Hero)
- Mettiamoci in Contatto (Payoff)
```

#### 6.4 - Pubblica
- Clicca **"Publish"** in alto a destra
- ✅ Container pubblicato!

---

## 📊 PARTE 4: Vedere i Dati in Google Analytics 4

### STEP 7: Controllo Real-Time (immediato)

#### 7.1 - Vai su Google Analytics 4
- https://analytics.google.com/
- Seleziona la tua proprietà

#### 7.2 - Real-Time Report
- Menu a sinistra: **"Reports"** → **"Realtime"**
- Nella sezione **"Event count by Event name"**

#### 7.3 - Testa dal vivo
1. Apri il sito in una tab privata/incognito
2. Clicca i bottoni CTA
3. Torna su GA4 Real-Time

Dovresti vedere:
```
Event name: cta_click
Event count: 1, 2, 3... (incrementa ad ogni click)
```

---

### STEP 8: Report Completo (dopo 24-48h)

#### 8.1 - Vai su Events Report
- Menu: **"Reports"** → **"Engagement"** → **"Events"**

#### 8.2 - Trova il tuo evento
Dovresti vedere nella tabella:
```
Event name         Event count    Total users
────────────────────────────────────────────
cta_click          XX             XX
page_view          XXX            XX
...
```

#### 8.3 - Analizza i dettagli
- Clicca su **"cta_click"** nella tabella
- Aggiungi dimensione secondaria:
  - **"Event parameter: event_action"**
  - **"Event parameter: event_label"**

Vedrai il breakdown:
```
event_action              event_label           Count
────────────────────────────────────────────────────
prenota_call              hero_section          XX
prenota_call              hero_section_desktop  XX
mettiamoci_in_contatto    payoff_section        XX
```

---

## 📈 PARTE 5: Creare Report Personalizzati (Opzionale)

### STEP 9: Esplora Dettagli CTA

#### 9.1 - Vai su Explore
- Menu: **"Explore"**
- Clicca **"Blank"** per nuovo report

#### 9.2 - Configura il Report
```
Dimensions (trascina):
├─ Event name
├─ Event parameter: event_action
├─ Event parameter: event_label
└─ Page location

Metrics (trascina):
├─ Event count
└─ Total users

Filters:
└─ Event name = cta_click
```

#### 9.3 - Visualizza
- Tipo: **Table**
- Rows: event_action, event_label
- Values: Event count, Total users

Vedrai una tabella chiara con:
```
Action                    Label                  Count    Users
──────────────────────────────────────────────────────────────
prenota_call              hero_section           XX       XX
prenota_call              hero_section_desktop   XX       XX
mettiamoci_in_contatto    payoff_section         XX       XX
```

---

## ✅ Checklist Finale

Prima di considerare tutto completato:

- [ ] Trigger "CTA Click Tracking" creato ✅
- [ ] 3 Variabili create (Category, Action, Label) ✅
- [ ] Tag GA4 "CTA Click Event" creato ✅
- [ ] Test in Preview mode passato ✅
- [ ] Container GTM pubblicato ✅
- [ ] Eventi visibili in GA4 Real-Time ✅
- [ ] (Dopo 24h) Dati nel report Events ✅

---

## 🆘 Troubleshooting

### Problema: Non vedo l'evento in Real-Time

**Soluzione:**
1. Verifica che il container GTM sia pubblicato
2. Usa tab Incognito per testare (evita cache)
3. Controlla che il tag GTM sia installato nel sito
4. Verifica in GTM Preview che il tag si attivi

### Problema: Tag non si attiva in Preview

**Soluzione:**
1. Verifica il Trigger CSS selector: `[data-gtm-event="cta_click"]`
2. Controlla che le variabili siano configurate correttamente
3. Ispeziona l'elemento HTML del bottone (F12) e verifica che abbia i data attributes

### Problema: Eventi duplicati

**Soluzione:**
- Se vedi eventi doppi, controlla di non avere altri tag/trigger che tracciano gli stessi click

---

## 📞 Supporto

Se hai problemi:
1. Verifica che il codice sia deployato su production
2. Controlla nella console browser (F12) eventuali errori
3. Usa GTM Preview mode per debug dettagliato

---

## 🎉 Risultato Finale

Una volta completato, potrai:
- ✅ Sapere quante persone cliccano "Prenota Call"
- ✅ Sapere quante persone cliccano "Mettiamoci in Contatto"
- ✅ Confrontare quale CTA converte meglio
- ✅ Vedere da quale sezione (Hero vs Payoff) arrivano più click
- ✅ Analizzare il comportamento mobile vs desktop

**Buon tracking! 🚀**

