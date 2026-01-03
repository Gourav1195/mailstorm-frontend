import { IconButton, styled } from "@mui/material";

// Complete design system with light and dark modes
export const DESIGN_SYSTEM = {
  modes: {
    dark: {
      colors: {
        // Core UI Colors
        background: '#0F1117',
        surface: '#1A1D29',
        surfaceElevated: '#242836',
        surfaceHighlight: '#2D3244',
        
        // Primary Colors
        primary: '#6366F1',
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',
        primaryBg: 'rgba(99, 102, 241, 0.12)',
        
        // Secondary Colors
        secondary: '#10B981',
        secondaryLight: '#34D399',
        secondaryDark: '#059669',
        secondaryBg: 'rgba(16, 185, 129, 0.12)',
        
        // Accent Colors
        accent: '#8B5CF6',
        accentLight: '#A78BFA',
        accentDark: '#7C3AED',
        accentBg: 'rgba(139, 92, 246, 0.12)',
        
        // Status Colors
        success: '#10B981',
        successLight: '#34D399',
        successDark: '#049a6fff',
        successBg: 'rgba(16, 185, 129, 0.12)',
        successBorder: 'rgba(16, 185, 129, 0.3)',
        
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        warningDark: '#ddaa2cff',
        warningBg: 'rgba(245, 158, 11, 0.12)',
        warningBorder: 'rgba(245, 158, 11, 0.3)',
        
        error: '#EF4444',
        errorLight: '#F87171',
        errorBg: 'rgba(239, 68, 68, 0.12)',
        errorBorder: 'rgba(239, 68, 68, 0.3)',
        
        info: '#3B82F6',
        infoLight: '#60A5FA',
        infoBg: 'rgba(59, 130, 246, 0.12)',
        infoBorder: 'rgba(59, 130, 246, 0.3)',
        
        // Text Colors
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        textDisabled: '#475569',
        textInverse: '#0F172A',
        
        // Border & Divider Colors
        border: '#334155',
        borderLight: '#475569',
        borderDark: '#1E293B',
        divider: 'rgba(255, 255, 255, 0.08)',
        dividerStrong: 'rgba(255, 255, 255, 0.12)',
        
        // Interactive Colors
        hover: 'rgba(99, 102, 241, 0.12)',
        hoverSecondary: 'rgba(255, 255, 255, 0.08)',
        active: 'rgba(99, 102, 241, 0.2)',
        focusRing: 'rgba(99, 102, 241, 0.4)',
        
        // Overlay & Backdrop
        backdrop: 'rgba(0, 0, 0, 0.6)',
        overlay: 'rgba(0, 0, 0, 0.4)',
        scrim: 'rgba(0, 0, 0, 0.5)',
        
        // Chart Colors (8-color palette)
        chart1: '#6366F1',  // Primary Blue
        chart2: '#10B981',  // Success Green
        chart3: '#F59E0B',  // Warning Yellow
        chart4: '#EF4444',  // Error Red
        chart5: '#8B5CF6',  // Accent Purple
        chart6: '#EC4899',  // Pink
        chart7: '#14B8A6',  // Teal
        chart8: '#F97316',  // Orange
        
        // Gradient Colors
        gradientPrimary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        gradientWarning: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        gradientError: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        gradientSurface: 'linear-gradient(135deg, #1A1D29 0%, #242836 100%)',
        
        // Shadow Colors
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowLight: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.5)',
        
        // Data Visualization
        dataPositive: '#10B981',
        dataNegative: '#EF4444',
        dataNeutral: '#94A3B8',
        dataHighlight: '#FBBF24',
      },
    },
    light: {
      colors: {
        // Core UI Colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#F1F5F9',
        surfaceHighlight: '#E2E8F0',
        
        // Primary Colors
        primary: '#4F46E5',
        primaryLight: '#6366F1',
        primaryDark: '#4338CA',
        primaryBg: 'rgba(79, 70, 229, 0.08)',
        
        // Secondary Colors
        secondary: '#059669',
        secondaryLight: '#10B981',
        secondaryDark: '#047857',
        secondaryBg: 'rgba(5, 150, 105, 0.08)',
        
        // Accent Colors
        accent: '#7C3AED',
        accentLight: '#8B5CF6',
        accentDark: '#6D28D9',
        accentBg: 'rgba(124, 58, 237, 0.08)',
        
        // Status Colors
        success: '#059669',
        successLight: '#10B981',
        successDark: '#047857',
        successBg: 'rgba(5, 150, 105, 0.08)',
        successBorder: 'rgba(5, 150, 105, 0.3)',
        
        warning: '#D97706',
        warningLight: '#F59E0B',
        warningDark: 'rgba(190, 143, 26, 1)',
        warningBg: 'rgba(217, 119, 6, 0.08)',
        warningBorder: 'rgba(217, 119, 6, 0.3)',
        
        error: '#DC2626',
        errorLight: '#EF4444',
        errorBg: 'rgba(220, 38, 38, 0.08)',
        errorBorder: 'rgba(220, 38, 38, 0.3)',
        
        info: '#2563EB',
        infoLight: '#3B82F6',
        infoBg: 'rgba(37, 99, 235, 0.08)',
        infoBorder: 'rgba(37, 99, 235, 0.3)',
        
        // Text Colors
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#64748B',
        textDisabled: '#94A3B8',
        textInverse: '#F8FAFC',
        
        // Border & Divider Colors
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        borderDark: '#CBD5E1',
        divider: 'rgba(0, 0, 0, 0.06)',
        dividerStrong: 'rgba(0, 0, 0, 0.1)',
        
        // Interactive Colors
        hover: 'rgba(79, 70, 229, 0.08)',
        hoverSecondary: 'rgba(0, 0, 0, 0.04)',
        active: 'rgba(79, 70, 229, 0.16)',
        focusRing: 'rgba(79, 70, 229, 0.3)',
        
        // Overlay & Backdrop
        backdrop: 'rgba(0, 0, 0, 0.4)',
        overlay: 'rgba(0, 0, 0, 0.2)',
        scrim: 'rgba(0, 0, 0, 0.3)',
        
        // Chart Colors (8-color palette)
        chart1: '#4F46E5',  // Primary Blue
        chart2: '#059669',  // Success Green
        chart3: '#D97706',  // Warning Orange
        chart4: '#DC2626',  // Error Red
        chart5: '#7C3AED',  // Accent Purple
        chart6: '#DB2777',  // Pink
        chart7: '#0D9488',  // Teal
        chart8: '#EA580C',  // Orange
        
        // Gradient Colors
        gradientPrimary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        gradientSuccess: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        gradientWarning: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        gradientError: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        gradientSurface: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        
        // Shadow Colors
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowLight: 'rgba(0, 0, 0, 0.05)',
        shadowDark: 'rgba(0, 0, 0, 0.2)',
        
        // Data Visualization
        dataPositive: '#059669',
        dataNegative: '#DC2626',
        dataNeutral: '#64748B',
        dataHighlight: '#F59E0B',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
    scale: {
      h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
      h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
      h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
      h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5 },
      h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
      subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.6 },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
      button: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, textTransform: 'none' },
      caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 },
      overline: { fontSize: '0.625rem', fontWeight: 600, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.05em' },
    }
  },
  spacing: {
    unit: 8,
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    section: '24px',
    container: '32px',
  }, 
  effects: {
    shadows: {
      dark: {
        default: '0 8px 32px rgba(0, 0, 0, 0.24)',
        elevated: '0 12px 48px rgba(0, 0, 0, 0.32)',
        // glow: '0 0 32px rgba(99, 102, 241, 0.12)',

        none: 'none',
        xs: '0 1px 2px rgba(0, 0, 0, 0.2)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.24)',
        md: '0 4px 16px rgba(0, 0, 0, 0.32)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
        xl: '0 12px 48px rgba(0, 0, 0, 0.48)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
        glow: '0 0 32px rgba(99, 102, 241, 0.16)',
      },
      light: {
        none: 'none',
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 16px rgba(0, 0, 0, 0.12)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.16)',
        xl: '0 12px 48px rgba(0, 0, 0, 0.2)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        glow: '0 0 32px rgba(79, 70, 229, 0.12)',
         default: '0 4px 24px rgba(0, 0, 0, 0.08)',
        elevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
        // glow: '0 0 32px rgba(79, 70, 229, 0.08)',
      }
    },
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
      full: '9999px',
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
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