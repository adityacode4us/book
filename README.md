# PageCraft AI — AI-Powered Visual Book Generator (MVP)

A high-performance, browser-based typesetting studio that transforms raw text and imagery into publication-grade book drafts, eliminating manual typesetting bottlenecks.

---

## 🌟 Key Features

- **Sequential Page-by-Page Studio**: Input raw copy and visual assets with live word and media tracking.
- **Dual AI Layout Synthesis**: Automatically generates **2 divergent layout options** per page:
  - *Option A: High-Impact Visual* (hero imagery, bold headlines, prominent callouts).
  - *Option B: Balanced Editorial Flow* (dense reading comfort, dual-column structure, subtle framing).
- **6 Professional Design Archetypes**:
  1. `Hero Split (50/50)`
  2. `Editorial Two-Column`
  3. `Asymmetric Showcase (70/30)`
  4. `Card Grid (Modular)`
  5. `Quote Focus (Keynote)`
  6. `Gallery Narrative (Multi-Image)`
- **Dual AI Provider Architecture**:
  - Direct integration with **Google Gemini** (Gemini 2.0 Flash / 1.5 Flash).
  - Direct integration with **OpenAI** (GPT-4o / GPT-4o-mini).
  - Built-in **Deterministic Heuristic Engine** for instant offline evaluation without API keys.
- **500-Page Scalability**:
  - Client-side **IndexedDB** (`Dexie.js`) persistent storage for hundreds of pages and binary image blobs.
  - $O(1)$ page-isolated prompt context budget (zero token overflow).
  - Virtualized filmstrip with page jump navigation.
  - Built-in **500-Page Scale Generator** to stress test storage and UI performance.
- **Book Reader & Print-to-PDF**:
  - Continuous vertical scroll or single-page slide viewer.
  - Dedicated print stylesheet ensuring clean page breaks and standard A4 proportions.
  - Single-click portable `.json` export and import.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📖 Detailed Documentation
For comprehensive details on system architecture, assumptions, trade-offs, and design rationale, see [DOCUMENTATION.md](./DOCUMENTATION.md).
