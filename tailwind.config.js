/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './index.ts', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ---- Palworld PDA design system ----
        abyss: '#0F172A', // deep slate background
        well: '#0B1120', // deepest content wells
        panel: '#1E293B', // elevated slate panel
        panel2: '#16223B', // raised hover surface
        paldium: '#06B6D4', // bright Paldium cyan
        paldiumdim: '#155E75',
        gold: '#F59E0B', // warning gold
        ember: '#EF4444', // fire orange-red
        neon: '#10B981', // accent neon green
        ink: '#E9EEF6', // primary text
        muted: '#B7C3D8', // secondary text — bright enough for dark panels
        faint: '#8A9BB4', // tertiary text — readable, no longer murky
        // ---- Elements ----
        neutral: '#94A3B8',
        fire: '#EF4444',
        water: '#38BDF8',
        electric: '#FACC15',
        grass: '#4ADE80',
        ice: '#67E8F9',
        ground: '#D6A35C',
        dark: '#8B5CF6',
        dragon: '#C084FC'
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 12px rgba(6,182,212,0.35)',
        glowlg: '0 0 24px rgba(6,182,212,0.45)',
        goldglow: '0 0 12px rgba(245,158,11,0.35)',
        neonglow: '0 0 12px rgba(16,185,129,0.35)',
        emberglow: '0 0 12px rgba(239,68,68,0.35)',
        card: '0 4px 18px rgba(2,8,23,0.5)'
      }
    }
  },
  plugins: []
};
