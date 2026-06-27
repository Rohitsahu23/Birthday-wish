# For My Love - Interactive Cinematic Birthday Experience for Kashish ❤️

This is an award-winning cinematic relationship timeline and birthday surprise built exclusively for **Kashish**. It features custom 3D starfields, interactive scrapbooks, hover-play video projectors, floating notes, live counts, heart gardens, and custom-synthesized HTML5 Canvas heart fireworks.

---

## 🚀 Quick Start

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Run Local Development Server
Start the local hot-rebuilding development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
Bundle the code and optimize assets for production:
```bash
npm run build
```
Production assets are generated inside the `dist/` directory.

### 4. Code Quality
Run code auditing and linter tasks:
```bash
npm run lint
```

---

## 🛠️ Folder & Code Architecture

- `src/components/`: Reusable components (e.g. 3D Memory Album sheets, video playback theaters, envelopes).
- `src/sections/`: Core storytelling sections (e.g. Hero, Timeline, Cinema, LoveLetter, Reasons, Forever, Finale).
- `src/data/`: Centralized JSON config files (e.g. memories, quotes, timeline chapters, wishes, promises, stars).
- `src/App.tsx`: Main layout, custom scroll parameters, and global event bindings.

---

## 🎨 Easter Eggs & Custom Actions

- **KASHISH Keyboard Emitter**: Type `"k", "a", "s", "h", "i", "s", "h"` (case-insensitive) anywhere on the keyboard to trigger a floating shower of rising hearts.
- **Star Note Uncovers**: Tap the interactive golden stars on the final pages to play procedural bell sweeps and reveal love notes.
- **Audio Slider cache**: Adjust the volume on the Music Disc card; values persist in local storage.

---

## 🌐 Production Deployment

This project compiles into zero-dependency optimized HTML/JS/CSS assets ready for static hosting.

### 1. Vercel / Netlify
Connect this repository to Vercel/Netlify. The settings are automatically discovered:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. GitHub Pages
To host on GitHub Pages:
1. Set up a GitHub Action to run `npm run build`.
2. Configure pages settings to serve from the `dist` folder.
