import { IconButton, styled } from "@mui/material";

// Complete design system with light and dark modes
export const DESIGN_SYSTEM = {
  modes: {
    dark: {
      colors: {
        background: '#0F1117',
        surface: '#1A1D29',
        surfaceElevated: '#242836',
        primary: '#6366F1',
        primaryLight: '#818CF8',
        secondary: '#10B981',
        accent: '#8B5CF6',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: '#334155',
        success: '#10B981',
        successBg: 'rgba(16, 185, 129, 0.1)',
        warning: '#F59E0B',
        warningBg: 'rgba(245, 158, 11, 0.1)',
        divider: 'rgba(255, 255, 255, 0.05)',
        hover: 'rgba(99, 102, 241, 0.08)',
        backdrop: 'rgba(0, 0, 0, 0.5)',
      },
    },
    light: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#F1F5F9',
        primary: '#4F46E5',
        primaryLight: '#6366F1',
        secondary: '#059669',
        accent: '#7C3AED',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#64748B',
        border: '#E2E8F0',
        success: '#059669',
        successBg: 'rgba(5, 150, 105, 0.1)',
        warning: '#D97706',
        warningBg: 'rgba(217, 119, 6, 0.1)',
        divider: 'rgba(0, 0, 0, 0.05)',
        hover: 'rgba(79, 70, 229, 0.08)',
        backdrop: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
    scale: {
      h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
      h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
      h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
      h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5 },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
      caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 },
    }
  },
  spacing: {
    unit: 8,
    section: 24,
    container: 32,
  },
  effects: {
    shadows: {
      dark: {
        default: '0 8px 32px rgba(0, 0, 0, 0.24)',
        elevated: '0 12px 48px rgba(0, 0, 0, 0.32)',
        glow: '0 0 32px rgba(99, 102, 241, 0.12)',
      },
      light: {
        default: '0 4px 24px rgba(0, 0, 0, 0.08)',
        elevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
        glow: '0 0 32px rgba(79, 70, 229, 0.08)',
      }
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      full: '9999px',
    }
  }
};

// Helper hook to use theme
export const useDesignSystem = (mode: 'light' | 'dark') => ({
  colors: DESIGN_SYSTEM.modes[mode].colors,
  typography: DESIGN_SYSTEM.typography,
  spacing: DESIGN_SYSTEM.spacing,
  effects: {
    ...DESIGN_SYSTEM.effects,
    shadows: DESIGN_SYSTEM.effects.shadows[mode],
  },
  mode,
});
export type DesignSystem = ReturnType<typeof useDesignSystem>;


export const ThemeToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    color: ds.colors.textSecondary,
    backgroundColor: ds.colors.hover,
    '&:hover': {
      backgroundColor: ds.colors.primary,
      color: '#FFFFFF',
    },
  };
});