import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { DESIGN_SYSTEM } from './theme';

export const useAppTheme = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  
  return {
    mode,
    colors: DESIGN_SYSTEM.modes[mode].colors,
    typography: DESIGN_SYSTEM.typography,
    spacing: DESIGN_SYSTEM.spacing,
    effects: {
      ...DESIGN_SYSTEM.effects,
      shadows: DESIGN_SYSTEM.effects.shadows[mode],
    },
  };
};
