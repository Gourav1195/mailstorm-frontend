import { Box, Button, Card, List, ListItem, Select, styled, Typography } from "@mui/material";
import { useDesignSystem } from "./theme";



// Styled Components with theme awareness
export const DashboardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    backgroundColor: ds.colors.background,
    minHeight: '100vh',
    padding: `${ds.spacing.container}px`,
    fontFamily: ds.typography.fontFamily,
    transition: 'background-color 0.3s ease, color 0.3s ease',
    '& *': {
      fontFamily: 'inherit',
      transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
    }
  };
});

export const SectionHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: `${ds.spacing.section}px`,
    paddingBottom: '16px',
    borderBottom: `1px solid ${ds.colors.divider}`,
  };
});

export const MetricCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    backgroundColor: ds.colors.surface,
    border: `1px solid ${ds.colors.border}`,
    borderRadius: ds.effects.borderRadius.md,
    boxShadow: ds.effects.shadows.default,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: ds.effects.shadows.elevated,
      borderColor: ds.colors.primary,
    },
    '& .MuiCardContent-root': {
      padding: '20px',
    }
  };
});

export const MetricHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

export const MetricValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: ds.colors.textPrimary,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  };
});

export const MetricLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: ds.typography.scale.body2.fontSize,
    color: ds.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  };
});

export const MetricTrend = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: ds.typography.scale.caption.fontSize,
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: ds.effects.borderRadius.full,
    backgroundColor: ds.colors.successBg,
    color: ds.colors.success,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    '&::before': {
      content: '"↗"',
      fontSize: '0.875rem',
    }
  };
});

export const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode' && prop !== 'color'
})<{ mode: 'light' | 'dark'; color?: 'primary' | 'secondary' | 'accent' }>(({ mode, color = 'primary' }) => {
  const ds = useDesignSystem(mode);
  const gradients = {
    primary: `linear-gradient(135deg, ${ds.colors.primary} 0%, ${ds.colors.accent} 100%)`,
    secondary: `linear-gradient(135deg, ${ds.colors.secondary} 0%, #34D399 100%)`,
    accent: `linear-gradient(135deg, ${ds.colors.accent} 0%, #D946EF 100%)`,
  };
  return {
    width: '48px',
    height: '48px',
    borderRadius: ds.effects.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradients[color],
    color: ds.colors.textPrimary,
    fontSize: '24px',
  };
});

export const PrimaryButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    backgroundColor: ds.colors.primary,
    color: '#FFFFFF',
    borderRadius: ds.effects.borderRadius.sm,
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: ds.typography.scale.body2.fontSize,
    border: `1px solid ${ds.colors.primary}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: ds.colors.primaryLight,
      transform: 'translateY(-1px)',
      boxShadow: ds.effects.shadows.glow,
    },
    '&:focus-visible': {
      outline: `2px solid ${ds.colors.primary}`,
      outlineOffset: '2px',
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  };
});

export const SecondaryButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    backgroundColor: 'transparent',
    color: ds.colors.textSecondary,
    borderRadius: ds.effects.borderRadius.sm,
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: ds.typography.scale.body2.fontSize,
    border: `1px solid ${ds.colors.border}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: ds.colors.hover,
      borderColor: ds.colors.primary,
      color: ds.colors.textPrimary,
    },
    '&:focus-visible': {
      outline: `2px solid ${ds.colors.primary}`,
      outlineOffset: '2px',
    }
  };
});

export const TimeSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    '& .MuiSelect-select': {
      padding: '4px 32px 4px 12px',
      fontSize: ds.typography.scale.caption.fontSize,
      color: ds.colors.textSecondary,
      fontWeight: 500,
      backgroundColor: ds.colors.surface,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: ds.colors.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: ds.colors.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: ds.colors.primary,
      borderWidth: '1px',
    },
    minWidth: '100px',
    height: '32px',
  };
});

export const ActivityList = styled(List, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    backgroundColor: ds.colors.surface,
    borderRadius: ds.effects.borderRadius.md,
    border: `1px solid ${ds.colors.border}`,
    padding: '0',
    boxShadow: ds.effects.shadows.default,
    '& .MuiListItem-root': {
      borderBottom: `1px solid ${ds.colors.divider}`,
      padding: '16px 20px',
      '&:last-child': {
        borderBottom: 'none',
      },
      '&:hover': {
        backgroundColor: ds.colors.hover,
      }
    }
  };
});

export const ActivityItem = styled(ListItem)({
  alignItems: 'flex-start',
  padding: '12px 16px',
  gap: '12px',
});

export const ActivityIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    width: '32px',
    height: '32px',
    borderRadius: ds.effects.borderRadius.sm,
    backgroundColor: `${ds.colors.primary}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ds.colors.primary,
    flexShrink: 0,
  };
});

export const ActivityTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: ds.typography.scale.body2.fontSize,
    fontWeight: 600,
    color: ds.colors.textPrimary,
    marginBottom: '2px',
  };
});

export const ActivitySubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: ds.typography.scale.caption.fontSize,
    color: ds.colors.textSecondary,
  };
});

export const ActivityTime = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => {
  const ds = useDesignSystem(mode);
  return {
    fontSize: ds.typography.scale.caption.fontSize,
    color: ds.colors.textTertiary,
    whiteSpace: 'nowrap',
  };
});
