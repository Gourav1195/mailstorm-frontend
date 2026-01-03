import React from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button, 
  Typography,
  Box,
  Avatar,
  Card,
  Divider
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { useDesignSystem } from "../../design/theme";

interface AllModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title?: string;
  message?: string;
  btntxt?: string;
  cancelText?: string;
  icon?: DynamicIconProps;
  color?: string;
  mode?: 'light' | 'dark';
  severity?: 'success' | 'error' | 'warning' | 'info' | 'delete';
}

const iconMap = {
  delete: DeleteIcon,
  success: CheckCircleIcon,
  error: ErrorOutlineIcon,
  cancel: CancelIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

interface DynamicIconProps {
  type: 'delete' | 'success' | 'error' | 'cancel' | 'warning' | 'info';
  sx?: object;
}

const DynamicIcon: React.FC<DynamicIconProps & { mode?: 'light' | 'dark' }> = ({ type, sx = {}, mode = 'light' }) => {
  const designSystem = useDesignSystem(mode);
  const IconComponent = iconMap[type];
  
  const getIconColor = () => {
    switch (type) {
      case 'delete': return designSystem.colors.error;
      case 'success': return designSystem.colors.success;
      case 'error': return designSystem.colors.error;
      case 'cancel': return designSystem.colors.warning;
      case 'warning': return designSystem.colors.warning;
      case 'info': return designSystem.colors.info;
      default: return designSystem.colors.primary;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'delete': return designSystem.colors.errorBg;
      case 'success': return designSystem.colors.successBg;
      case 'error': return designSystem.colors.errorBg;
      case 'cancel': return designSystem.colors.warningBg;
      case 'warning': return designSystem.colors.warningBg;
      case 'info': return designSystem.colors.infoBg;
      default: return designSystem.colors.primaryBg;
    }
  };

  const iconStyle = {
    fontSize: '48px',
    color: getIconColor(),
    ...sx,
  };
  
  return (
    <Avatar
      sx={{
        width: 64,
        height: 64,
        backgroundColor: getIconBg(),
        border: `2px solid ${getIconColor()}30`,
        boxShadow: `0 4px 20px ${getIconColor()}30`,
      }}
    >
      <IconComponent sx={iconStyle} />
    </Avatar>
  );
};

const AllModal: React.FC<AllModalProps> = ({ 
  open, 
  handleClose, 
  handleConfirm, 
  title, 
  message, 
  btntxt, 
  cancelText = 'Cancel',
  icon, 
  color, 
  mode = 'light',
  severity = 'delete'
}) => {
  const designSystem = useDesignSystem(mode);
  const iconType = icon?.type || severity;

  const getButtonColor = () => {
    switch (iconType) {
      case 'success': return designSystem.colors.success;
      case 'error': return designSystem.colors.error;
      case 'warning': return designSystem.colors.warning;
      case 'info': return designSystem.colors.info;
      case 'cancel': return designSystem.colors.warning;
      default: return designSystem.colors.error;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: designSystem.effects.borderRadius.lg,
          overflow: 'hidden',
          backgroundColor: designSystem.colors.surface,
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.effects.shadows.xl,
        }
      }}
    >
      <Box sx={{ p: 3, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign: 'center', }}>
        <DynamicIcon type={iconType} mode={mode} />
        
        <Typography variant="h6" sx={{ 
          mt: 2, 
          color: designSystem.colors.textPrimary,
          fontWeight: 600,
        }}>
          {title || (iconType === 'success' ? 'Success' : 
                    iconType === 'error' ? 'Error' :
                    iconType === 'warning' ? 'Warning' :
                    iconType === 'info' ? 'Information' : 'Confirm Action')}
        </Typography>
        
        <Typography sx={{ 
          mt: 1, 
          color: designSystem.colors.textSecondary,
          lineHeight: 1.6,
          fontSize: '0.95rem',
        }}>
          {message || (iconType === 'delete' ? 
            "Are you sure you want to delete this item? This action cannot be undone." :
            "Please confirm this action.")}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: designSystem.colors.border }} />
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: designSystem.colors.border,
            color: designSystem.colors.textSecondary,
            '&:hover': {
              borderColor: designSystem.colors.border,
              backgroundColor: designSystem.colors.hoverSecondary,
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            background: iconType === 'success' ? designSystem.colors.gradientSuccess :
                      iconType === 'error' ? designSystem.colors.gradientError :
                      iconType === 'warning' ? designSystem.colors.gradientWarning :
                      designSystem.colors.gradientPrimary,
            '&:hover': {
              opacity: 0.9,
            }
          }}
        >
          {btntxt || (iconType === 'success' ? 'OK' : 
                     iconType === 'delete' ? 'Delete' : 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllModal;