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

## 🆕 Recent updates

The project has recent UI updates focused on the mobile header and navigation. Summary:

- Centered the logo and navigation on mobile devices for a cleaner layout.
- Increased mobile navigation font size to improve readability and tap targets (`text-lg`).
- Mobile linkbar now has a semi-transparent black background (`bg-black/80`) with padding and rounded corners.
- Active links keep the brass accent color; other mobile links use white text for contrast.

These changes were introduced on branch `feature/mobile-preview` (commit 5a9d161 at the time of writing). If you'd like a narrower commit scope (only the header changes), consider creating a focused branch/PR and I can prepare that for review.

See `docs/CHANGELOG.md` for a brief record of recent edits and their intent.

If you want to roll back or tweak the mobile styles (opacity, padding, text size), change the Tailwind utility classes in `src/components/Header.tsx`:

- Mobile menu container: adjust `bg-black/80`, `px-4`, `py-3`, `rounded-lg` as needed.
- Mobile link text size: `text-lg` -> `text-xl` or `text-base`.
- Link colors: `text-white` / `text-brass` can be adjusted to new tokens if you introduce them.

## 📝 Lizenz

© 2025 Aethersalon 1889. Alle Rechte vorbehalten.
# aethersalon
