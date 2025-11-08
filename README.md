# Aethersalon 1889 - Steampunk Website

Eine professionelle React-Webseite für Aethersalon 1889 mit viktorianischem Design.

## 🎨 Features

- ✨ Dark/Light Mode Toggle
- 🎭 Viktorianisches Design mit Brass-Akzenten
- ⚙️ Animierte Zahnrad-Hintergründe
- 📱 Vollständig Responsive (Mobile, Tablet, Desktop)
- 🎬 Smooth Scrolling & Framer Motion Animationen
- 🔗 React Router v6 Navigation
- 🎨 Tailwind CSS Styling
- ♿ WCAG AA Accessibility Konform

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **HTTP Client:** Axios (für Airtable Integration)

## 📦 Installation

1. Klone das Repository
2. Installiere Dependencies:
```bash
npm install
```

3. Erstelle eine `.env` Datei basierend auf `.env.example`:
```bash
cp .env.example .env
```

4. Füge deine API-Keys hinzu:
   - Airtable API Key & Base ID
   - Formspree Endpoint
   - Google Analytics ID (optional)

5. Füge das Logo hinzu:
   - Lege `Aethersalon.png` in den `public/` Ordner

## 🏃‍♂️ Development

Starte den Development Server:
```bash
npm run dev
```

Die Seite ist dann verfügbar unter: http://localhost:3000

## 🏗️ Build

Erstelle eine Production Build:
```bash
npm run build
```

Vorschau der Production Build:
```bash
npm run preview
```

## 📁 Projektstruktur

```
aethersalon-website/
├── public/              # Statische Assets (Logo, Bilder)
├── src/
│   ├── components/      # Wiederverwendbare Komponenten
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Gears.tsx
│   ├── context/        # React Context (Theme)
│   │   └── ThemeContext.tsx
│   ├── pages/          # Seiten-Komponenten
│   │   └── Home.tsx
│   ├── services/       # API Services (Airtable, etc.)
│   ├── App.tsx         # Main App Component
│   ├── main.tsx        # Entry Point
│   └── index.css       # Global Styles
├── .env.example        # Environment Variables Template
├── index.html          # HTML Template
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind Configuration
├── tsconfig.json       # TypeScript Configuration
└── vite.config.ts      # Vite Configuration
```

## 🎨 Design System

### Farben

**Dark Mode (Standard):**
- Background: `#20222A`
- Text: `#d8d1c3`
- Accent: `#cdab67` (Brass)

**Light Mode:**
- Background: `#f6e9bd`
- Text: `#20222A`
- Accent: `#cdab67` (Brass)

### Typografie

- **Überschriften:** Playfair Display (oder EFCO Brookshire wenn verfügbar)
- **Fließtext:** Inter

## 🔌 Airtable Integration

### Tables Setup

**Products Table:**
- Name (Single line text)
- Description (Long text)
- Price (Number)
- Category (Single select)
- Images (Attachment)
- Status (Single select)

**Events Table:**
- Title (Single line text)
- Date (Date)
- Location (Single line text)
- Description (Long text)
- Category (Single select)
- Image (Attachment)

## 📋 Seiten

- [x] Home - Hero, Produkt-Teaser, Event-Teaser, Partner
- [ ] Über Mich - Text-Bild-Blöcke
- [ ] Veranstaltungen - Event-Liste mit Filtern
- [ ] Event Detail - Einzelansicht
- [ ] Produkte - Produkt-Grid mit Filtern
- [ ] Produkt Detail - Details + Email-Anfrage
- [ ] History - Long-form Content
- [ ] Werkstatt - Behind-the-Scenes
- [ ] Kontakt - Formspree Formular
- [ ] Impressum & Datenschutz

## 🚧 Nächste Schritte

1. Logo (`Aethersalon.png`) in `public/` Ordner hinzufügen
2. Airtable Base erstellen und API-Keys konfigurieren
3. Formspree Account erstellen und Endpoint konfigurieren
4. Statische Seiten implementieren
5. Airtable Integration vervollständigen
6. Cookie-Banner hinzufügen
7. Google Analytics integrieren

## 📝 Lizenz

## 🧾 README maintenance

This README is the single source of truth for developer onboarding and contains build/deploy commands, environment variables, and high-level architecture notes.

- Location: `README.md` (project root). An AI-focused helper file was also added at `.github/copilot-instructions.md` — keep both in sync when you change scripts, env vars, or deployment details.
- When you add or change scripts in `package.json`, update this README's "Development" and "Build" sections and the `.github/copilot-instructions.md` file.
- For small edits, prefer editing `src/data/sampleData.ts` to update UI content during development rather than wiring real APIs.

If you'd like automation, consider adding a lightweight GitHub Action that runs on changes to `package.json`, `vite.config.ts`, or `.github/**/*` and opens a reminder issue or PR to review the README.

© 2025 Aethersalon 1889. Alle Rechte vorbehalten.
# aethersalon

## 🚢 Deploy: Vercel (recommended) + Ionos (DNS)

We recommend deploying the site and serverless functions to Vercel and keeping the domain registered at Ionos. Set the server-side secrets in Vercel (never in client-side VITE_ vars).

Steps (quick):

1. Install Vercel CLI (optional for local dev):

```bash
npm i -g vercel
```

2. Add project to Vercel (Dashboard → New Project → Import from Git).

3. Configure environment variables in Vercel (Project → Settings → Environment Variables):

- `AIRTABLE_API_KEY` = <your_airtable_api_key> (server-side secret)
- `AIRTABLE_BASE_ID` = appUGS2z6I4KxAEsQ
- `AIRTABLE_PRODUCTS_TABLE` = Produkte

Do NOT prefix these with `VITE_` — serverless functions must read secrets from process.env.

4. Deploy: push to the repository branch connected to Vercel or use the Vercel UI to deploy. The proxy endpoint will be available at `https://<your-deployment-domain>/api/products`.

5. Point your Ionos domain to Vercel:
   - In Vercel Dashboard → Domains → Add Domain (yourdomain.com). Vercel will show the DNS records to add.
   - In Ionos domain management, add the records Vercel shows. Typical records:
      - A record for the root/apex: `76.76.21.21`
      - CNAME for `www` → `cname.vercel-dns.com` (or the target Vercel shows)
      - If Vercel asks for a TXT verification record, add that too.
   - Wait for DNS propagation; Vercel will verify and provision TLS automatically.

Local development with serverless functions:

- To run the serverless function locally and test `/api/products`, use `vercel dev` which runs both frontend and functions and reads a local (untracked) `.env` file:

```bash
# create an untracked .env for local dev (DO NOT commit)
echo "AIRTABLE_API_KEY=your_local_key" > .env
echo "AIRTABLE_BASE_ID=appUGS2z6I4KxAEsQ" >> .env
echo "AIRTABLE_PRODUCTS_TABLE=Produkte" >> .env

npx vercel dev
```

What to check after deploy
- Visit `https://your-domain/products`. The page should fetch `/api/products` and display Airtable rows.
- If empty or failing, check Vercel Function logs (Vercel → Functions → Logs) and browser console/network.

Security reminder
- Rotate the token you previously pasted in chat (you mentioned rotating it). Only store the active token in Vercel's Environment Variables (Production/Preview/Development as needed). Never commit secrets to git.

