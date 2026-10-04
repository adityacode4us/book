# AI-Powered Visual Book Generator (MVP) — Project Roadmap & Steps

## 1. Objective & Overview
Build a browser-based application that converts raw text and images into a beautifully typeset visual book draft page-by-page. For marketing and content teams producing long documents (up to 500 pages), this automates initial layout decisions by offering **two distinct AI-designed layout options** per page.

---

## 2. Core Architecture & Strategic Solutions

| Constraint / Requirement | Architectural Solution |
| :--- | :--- |
| **500-Page Scalability** | **IndexedDB & Virtualization**: `localStorage` crashes after 5MB. We use **IndexedDB** (`Dexie.js`) for binary image blobs and page state, combined with virtualized page navigation to keep browser memory lean. |
| **LLM Context Budget** | **Isolated $O(1)$ Page Processing**: Layout requests are processed one page at a time. The prompt only contains the persistent Book Context (Title + Theme) and the current page content (text + image metadata), ensuring no context overflow. |
| **Reliability & Immediate Testing** | **Dual AI System (Real + Offline Mock)**: Direct client-side integration with Google Gemini / OpenAI, plus a built-in deterministic heuristic layout engine that works offline with zero API key configuration. |
| **Typesetting Quality** | **Declarative Semantic Archetypes**: Rather than letting the LLM generate unconstrained CSS, the AI selects and configures semantic design archetypes (Hero Split, 2-Column Editorial, Asymmetric 70/30, Card Grid, Quote Focus, Gallery) rendered via Tailwind CSS. |

---

## 3. Detailed Step-by-Step Execution Plan

### Step 1: Project Setup & Modern Tooling
- Initialize a **Vite + React 19 + TypeScript** application.
- Install and configure **Tailwind CSS**, **Lucide Icons** (`lucide-react`), and **Dexie.js** (`dexie`).
- Setup folder structure:
  - `src/types/`: Types for Book, Page, LayoutSchema, and AI responses.
  - `src/services/`: AI providers (Gemini, OpenAI, Heuristic Mock) and IndexedDB storage.
  - `src/components/`: Layout renderers, Page Studio, Filmstrip, Book Reader, and Modals.
  - `src/hooks/`: Custom hooks for book state, active page, and storage operations.
  - `src/utils/`: Print formatting, image compression, and sample data generators.

### Step 2: Typesetting Engine & Declarative Layout Schemas
- Define the `LayoutCandidate` schema:
  - `archetype`: `'hero-split' | 'editorial-two-column' | 'asymmetric-showcase' | 'card-grid' | 'quote-focus' | 'gallery-narrative'`
  - `contentDistribution`: Title, lead paragraph, body columns, highlight callouts, image placements.
  - `visualStyles`: Color accents, typography sizing, border/card treatments, whitespace padding.
- Build 6 dedicated React layout renderers with print-ready aspect ratios (A4 / US Letter portrait and landscape support).

### Step 3: Dual AI Layout Engine (Real AI + Deterministic Heuristic)
- **Prompt Engineering**: Instruct LLMs to evaluate page content density and return two genuinely divergent choices:
  - *Option A (Visual Punch)*: Emphasizes hero imagery, large headlines, and visual callouts.
  - *Option B (Editorial Flow)*: Emphasizes multi-column reading comfort, structured hierarchy, and subtle graphics.
- **Provider Integrations**:
  - `GeminiService`: Using Gemini Flash with structured JSON output.
  - `OpenAIService`: Using GPT-4o / GPT-4o-mini structured schema output.
  - `MockLayoutService`: Instant rule-based layout generator analyzing text length and image count for instant offline evaluation.

### Step 4: IndexedDB Storage & High-Capacity Asset Handling
- Initialize `Dexie` database with tables:
  - `books`: ID, title, objective, theme, createdAt, updatedAt.
  - `pages`: ID, bookId, pageNumber, rawText, imageIds, candidateLayouts, selectedLayoutId.
  - `assets`: ID, dataBlob, mimeType, filename, createdAt.
- Implement object URL management to load images on-demand without memory leaks.

### Step 5: Studio UI & Comparison Workflow
- **Book Setup View**: Modal or wizard to configure book title, objective, target tone, and color accent palette.
- **Page Content Studio**:
  - Text input (Markdown / clean plain text).
  - Multi-image dropzone with preview, reordering, and captioning.
  - "Generate Layouts" trigger button.
- **Side-by-Side Layout Comparison**:
  - Simultaneous interactive preview of Option A and Option B.
  - Single-click selection ("Choose Option A" / "Choose Option B") to finalize the page and move to the next page.
- **Filmstrip Navigation**:
  - Bottom scrollable thumbnail strip of all pages with quick-jump, reorder, delete, and add-page controls.

### Step 6: Full Book Reader & Export Capabilities
- Fullscreen Reader View to preview the entire generated book in sequence.
- Print-to-PDF formatting with standard page breaks (`break-after: page`).
- Export and import book project file (JSON package) for draft portability.

### Step 7: 500-Page Stress Testing & Performance Optimization
- Virtualized list rendering for thumbnail filmstrip to handle 500 pages smoothly.
- Benchmark memory footprint with large image sets and ensure instant page transitions.

### Step 8: Documentation & Delivery
- Create comprehensive `DOCUMENTATION.md` detailing:
  - Technical approach & architecture diagram.
  - Assumptions made during development.
  - Trade-offs (Client-side vs Server-side, Declarative Archetypes vs Freeform HTML).
  - User guide and future enhancements.

---

## 4. Deliverables Matrix
- [x] Step-by-step Project Plan (`PROJECT_EXECUTION_PLAN.md`)
- [ ] Working web application (Vite + React + Tailwind + Dexie)
- [ ] 6 Declarative layout archetype renderers
- [ ] Dual AI Layout Engine (Gemini, OpenAI & Offline Mock)
- [ ] Side-by-side layout selection interface
- [ ] IndexedDB storage capable of hundreds of pages and images
- [ ] Book preview & Print-to-PDF export
- [ ] Architecture and trade-offs documentation
