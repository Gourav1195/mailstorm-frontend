import { ButtonGroup, styled } from '@mui/material';
import { DESIGN_SYSTEM } from 'design/theme';

const TimeFrameButtonGroup = styled(ButtonGroup, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surfaceElevated,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.md,
  padding: '4px',
  gap: '4px',
  boxShadow: DESIGN_SYSTEM.effects.shadows[mode].xs,
}));

export default TimeFrameButtonGroup;