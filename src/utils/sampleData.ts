import { BookMetadata, BookPage, PageImage } from '../types/book';

// High quality royalty-free placeholder images for architectural/editorial aesthetics
export const SAMPLE_IMAGES: PageImage[] = [
  {
    id: 'sample-img-1',
    name: 'Modern Architecture',
    dataUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fig 1.1: Structural symmetry and modern glass elevations.',
  },
  {
    id: 'sample-img-2',
    name: 'Creative Studio Workspace',
    dataUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fig 1.2: Agile collaborative environments driving strategic alignment.',
  },
  {
    id: 'sample-img-3',
    name: 'Data Analytics & Strategy',
    dataUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fig 1.3: Real-time telemetry and enterprise KPI performance.',
  },
];

export const INITIAL_SAMPLE_TEXTS = [
  `# The Future of Brand Typesetting
Transforming raw marketing content into breathtaking publications requires a fusion of computational design and editorial precision.

Modern organizations generate content at unprecedented velocity, yet the typesetting bottleneck remains stubbornly analog. When designers spend weeks manually nudging margins and aligning pull quotes, the value of fresh perspective depreciates.

- Intelligent grid systems synthesize layout rules instantly.
- Algorithmic balance ensures visual harmony between photography and prose.
- Rapid divergence unlocks creative iteration rather than tedious repetition.

"Design is not merely what it looks like; design is the foundational architecture of human comprehension."`,

  `# Market Penetration & Strategic Execution
Navigating crowded enterprise landscapes demands clarity of purpose and frictionless narrative flow.

In our longitudinal study across 240 global marketing organizations, 78% of product launch delays stemmed from document preparation cycles rather than strategic misalignment. 

By institutionalizing automated typography blueprints, cross-functional teams reduce production latency from weeks to minutes, democratizing executive-grade publishing across every business unit.`,

  `# Quantitative Horizons: 2026 Telemetry
Accelerated computational workflows redefine creative bandwidth across the enterprise ecosystem.

- Phase 1: Real-time layout synthesis with semantic token parsing.
- Phase 2: Autonomous color harmonization mapped to corporate brand books.
- Phase 3: Dynamic multi-device pagination and vector export parity.

Every metric demonstrates that when teams liberate time from repetitive production, creative focus shifts entirely toward substantive messaging.`,
];

export function createDefaultBook(): BookMetadata {
  return {
    id: `book-${Date.now()}`,
    title: 'The Modern Marketing Playbook',
    subtitle: 'Strategic Typesetting & Algorithmic Publication Design',
    objective: 'Demonstrate automated page generation for enterprise marketing teams',
    theme: 'modern',
    aspectRatio: 'a4-portrait',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
