import { Box, AppBar, TextField, Typography, IconButton, styled } from '@mui/material';  
import { DESIGN_SYSTEM } from '../theme';
// Theme-aware styled components
export const ThemeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  display: 'flex',
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.background,
  minHeight: '100vh',
  transition: 'background-color 0.3s ease',
}));

export const ThemeAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode, theme }) => ({
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surface,
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  borderBottom: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
  boxShadow: DESIGN_SYSTEM.effects.shadows[mode].default,
  zIndex: theme.zIndex.drawer + 1,
}));

export const ThemeTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surfaceElevated,
    color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
    '& fieldset': {
      borderColor: DESIGN_SYSTEM.modes[mode].colors.border,
    },
    '&:hover fieldset': {
      borderColor: DESIGN_SYSTEM.modes[mode].colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: DESIGN_SYSTEM.modes[mode].colors.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  },
  '& .MuiInputBase-input::placeholder': {
    color: DESIGN_SYSTEM.modes[mode].colors.textTertiary,
  },
}));

export const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const LogoText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  marginLeft: "4px",
}));

export const WelcomeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  lineHeight: DESIGN_SYSTEM.typography.scale.body2.lineHeight,
}));

export const ActionIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  '&:hover': {
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.hover,
  },
}));

export const UserInfo = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  marginLeft: '8px',
  '& .MuiTypography-root': {
    color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  },
  '& .MuiTypography-body2': {
    fontSize: DESIGN_SYSTEM.typography.scale.caption.fontSize,
    color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  },
}));