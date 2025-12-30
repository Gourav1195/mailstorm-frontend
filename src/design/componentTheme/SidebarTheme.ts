import { Drawer, Box, Typography, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import { DESIGN_SYSTEM } from '../theme';
// Theme-aware styled components
export const SidebarContainer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  '& .MuiDrawer-paper': {
    width: '240px',
    boxSizing: 'border-box',
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surface,
    borderRight: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
    color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
}));

export const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: "20px",
  marginBottom: "5px",
  gap: "8px",
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

export const MenuList = styled(List)({
  padding: '8px',
});

// Fix: Use 'as any' for styled component to bypass TypeScript issues
export const MainMenuItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'mode'
})<{ active: boolean; mode: 'light' | 'dark' }>(({ active, mode }) => ({
  color: active ? DESIGN_SYSTEM.modes[mode].colors.primary : DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  backgroundColor: active ? `${DESIGN_SYSTEM.modes[mode].colors.primary}15` : 'transparent',
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  margin: '4px 0',
  padding: '10px 16px',
  '&:hover': {
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.hover,
  },
  transition: 'all 0.2s ease',
})) as any; // Type assertion to fix component prop issue

export const SubMenuList = styled(List)({
  padding: '0 0 0 16px',
});

// Fix: Use 'as any' for styled component to bypass TypeScript issues
export const SubMenuItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'mode'
})<{ active: boolean; mode: 'light' | 'dark' }>(({ active, mode }) => ({
  color: active ? DESIGN_SYSTEM.modes[mode].colors.primary : DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  backgroundColor: active ? `${DESIGN_SYSTEM.modes[mode].colors.primary}15` : 'transparent',
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  padding: '8px 16px 8px 32px',
  margin: '2px 0',
  '&:hover': {
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.hover,
  },
  transition: 'all 0.2s ease',
})) as any; // Type assertion to fix component prop issue

export const SubMenuDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'mode'
})<{ active: boolean; mode: 'light' | 'dark' }>(({ active, mode }) => ({
  width: 6,
  height: 6,
  backgroundColor: active ? DESIGN_SYSTEM.modes[mode].colors.primary : DESIGN_SYSTEM.modes[mode].colors.textTertiary,
  borderRadius: '50%',
  marginRight: '12px',
  transition: 'background-color 0.2s ease',
}));

export const MenuIconWrapper = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'mode'
})<{ active: boolean; mode: 'light' | 'dark' }>(({ active, mode }) => ({
  color: active ? DESIGN_SYSTEM.modes[mode].colors.primary : DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  minWidth: '36px',
  transition: 'color 0.2s ease',
}));

export const SubMenuText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
    fontWeight: 400,
  },
});
