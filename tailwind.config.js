/** @type {import('tailwindcss').Config} */

// CareFrame design tokens.
//
// Two things live here at once, on purpose:
//
//  1. Named brand scales (`teal`, `oat`, `mulberry`) that new code writes against.
//  2. Overrides of Tailwind's stock `blue` / `gray` / `purple` / `indigo` scales with
//     those same ramps, so any component not yet migrated still renders on-brand
//     instead of reverting to stock Tailwind blue-and-grey.
//
// green / red / orange / yellow stay exactly as Tailwind ships them. They carry
// clinical meaning — success, error, risk level — and must not drift for aesthetics.

/** Primary. Sea Mist 400 / Deep Sea 600 / Slate Teal 800. */
const teal = {
  50: '#F2F8F7',
  100: '#DFEFED',
  200: '#C0E0DC',
  300: '#A9D7D1',
  400: '#78BDB5',
  500: '#46918C',
  600: '#2C6E6B',
  700: '#255B5B',
  800: '#1F4A4C',
  900: '#1A3C3E',
  950: '#112829',
}

/** Warm neutrals. Replaces grey everywhere — this is the domiciliary signal. */
const oat = {
  50: '#FAF8F4',
  100: '#F3EFE8',
  200: '#E6E0D5',
  300: '#D4CCBD',
  400: '#A69D8C',
  500: '#716A5A',
  600: '#635C4E',
  700: '#4F4A40',
  800: '#3A352E',
  900: '#2E2C28',
  950: '#1F1C18',
}

/** Reserved for people in the record — carers, next of kin, relationships. Never state. */
const mulberry = {
  50: '#FAF4F6',
  100: '#F4E7EC',
  200: '#E8CFD9',
  300: '#D4AEC0',
  400: '#B2819A',
  500: '#9E6B82',
  600: '#8F5C72',
  700: '#774B5F',
  800: '#5F3C4C',
  900: '#4D3240',
  950: '#2C1C24',
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: teal,
        teal,
        oat,
        mulberry,

        // Legacy scales, remapped so unmigrated markup stays on-brand.
        blue: teal,
        indigo: teal,
        gray: oat,
        purple: teal,
      },

      fontFamily: {
        sans: ['Public Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },

      // Fixed rem scale at a ~1.2 ratio. Product UI, not fluid display type.
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }], // 11 — eyebrows
        xs: ['0.75rem', { lineHeight: '1.125rem' }],                            // 12
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],                           // 13 — labels
        base: ['0.875rem', { lineHeight: '1.375rem' }],                         // 14 — UI body
        md: ['1rem', { lineHeight: '1.5rem' }],                                 // 16 — inputs
        lg: ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }], // 18
        xl: ['1.3125rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],// 21
        '2xl': ['1.5625rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }], // 25
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.022em' }],
      },

      // Softened one step from the original 4–14px ramp: still a clinical
      // record, but sheets read as paper laid down rather than boxes drawn.
      borderRadius: {
        sm: '5px',
        DEFAULT: '7px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },

      // Low and offset. Clinical, not glossy — never a zero-offset halo.
      boxShadow: {
        xs: '0 1px 2px rgb(31 28 24 / 0.05)',
        sm: '0 1px 3px rgb(31 28 24 / 0.07), 0 1px 2px rgb(31 28 24 / 0.04)',
        md: '0 2px 8px rgb(31 28 24 / 0.08)',
        lg: '0 8px 24px rgb(31 28 24 / 0.10)',
        xl: '0 16px 48px rgb(31 28 24 / 0.14)',
        rail: 'inset -1px 0 0 rgb(31 28 24 / 0.06)',
        // A sheet resting on the oat ground: hairline-weight, offset, warm.
        sheet: '0 1px 2px rgb(31 28 24 / 0.04), 0 4px 16px -6px rgb(31 28 24 / 0.08)',
        focus: '0 0 0 3px rgb(44 110 107 / 0.20)',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '180ms',
        slow: '220ms',
      },

      keyframes: {
        'settle-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'settle-in': 'settle-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
