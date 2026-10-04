import { ThemeType, VisualConfig } from '../../types/book';

export function getThemeClasses(theme: ThemeType, colorScheme: VisualConfig['colorScheme']) {
  // Base page canvas colors
  switch (theme) {
    case 'editorial':
      return {
        bg: 'bg-[#faf8f5]',
        cardBg: 'bg-[#f4efe8]',
        text: 'text-[#232323]',
        textMuted: 'text-[#5a5651]',
        headline: 'text-[#141414] font-serif',
        accent: 'text-amber-800',
        accentBg: 'bg-amber-100/70 border-amber-300',
        border: 'border-[#e4ded5]',
        quoteBorder: 'border-amber-700',
        badge: 'bg-amber-900 text-amber-50',
      };
    case 'minimal':
      return {
        bg: 'bg-white',
        cardBg: 'bg-slate-50',
        text: 'text-zinc-800',
        textMuted: 'text-zinc-500',
        headline: 'text-black font-sans tracking-tight',
        accent: 'text-zinc-900',
        accentBg: 'bg-zinc-100 border-zinc-300',
        border: 'border-zinc-200',
        quoteBorder: 'border-zinc-900',
        badge: 'bg-zinc-900 text-zinc-100',
      };
    case 'corporate':
      return {
        bg: 'bg-slate-50',
        cardBg: 'bg-white',
        text: 'text-slate-800',
        textMuted: 'text-slate-500',
        headline: 'text-slate-900 font-sans font-bold',
        accent: 'text-blue-700',
        accentBg: 'bg-blue-50/80 border-blue-200',
        border: 'border-slate-200',
        quoteBorder: 'border-blue-600',
        badge: 'bg-blue-800 text-blue-50',
      };
    case 'vibrant':
      return {
        bg: 'bg-gradient-to-br from-violet-50/40 via-white to-pink-50/30',
        cardBg: 'bg-white/90 shadow-sm backdrop-blur',
        text: 'text-slate-900',
        textMuted: 'text-slate-600',
        headline: 'text-violet-950 font-sans font-extrabold',
        accent: 'text-violet-600',
        accentBg: 'bg-violet-100/70 border-violet-200',
        border: 'border-violet-100',
        quoteBorder: 'border-violet-600',
        badge: 'bg-violet-600 text-white',
      };
    case 'classic':
      return {
        bg: 'bg-[#fcfbf9]',
        cardBg: 'bg-[#f6f3ee]',
        text: 'text-stone-900',
        textMuted: 'text-stone-600',
        headline: 'text-stone-950 font-serif font-bold tracking-wide',
        accent: 'text-rose-900',
        accentBg: 'bg-rose-50 border-rose-200',
        border: 'border-stone-300',
        quoteBorder: 'border-rose-900',
        badge: 'bg-rose-950 text-rose-50',
      };
    case 'modern':
    default:
      return {
        bg: 'bg-white',
        cardBg: 'bg-slate-50',
        text: 'text-slate-800',
        textMuted: 'text-slate-500',
        headline: 'text-slate-950 font-sans font-bold',
        accent: 'text-indigo-600',
        accentBg: 'bg-indigo-50 border-indigo-100',
        border: 'border-slate-200',
        quoteBorder: 'border-indigo-600',
        badge: 'bg-indigo-600 text-white',
      };
  }
}

export function getFontFamilyClass(font: VisualConfig['fontFamily']): string {
  switch (font) {
    case 'serif':
      return 'font-serif';
    case 'display':
      return 'font-sans font-semibold tracking-tight';
    case 'classic':
      return 'font-serif tracking-normal';
    case 'sans':
    default:
      return 'font-sans';
  }
}
