import { Button, styled } from '@mui/material';
import { DESIGN_SYSTEM } from 'design/theme';

const TimeFrameButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode' && prop !== 'active'
})<{ mode: 'light' | 'dark'; active: boolean }>(({ mode, active }) => ({
  textTransform: 'none',
  fontSize: DESIGN_SYSTEM.typography.scale.caption.fontSize,
  fontWeight: active ? 600 : 500,
  padding: '6px 16px',
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  backgroundColor: active ? DESIGN_SYSTEM.modes[mode].colors.primary : 'transparent',
  color: active ? '#FFFFFF' : DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  border: 'none',
  minWidth: '70px',
  transition: DESIGN_SYSTEM.effects.transitions.fast,
  '&:hover': {
    backgroundColor: active ? 
      DESIGN_SYSTEM.modes[mode].colors.primaryLight : 
      DESIGN_SYSTEM.modes[mode].colors.hover,
    border: 'none',
    transform: active ? 'none' : 'translateY(-1px)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

export default TimeFrameButton;