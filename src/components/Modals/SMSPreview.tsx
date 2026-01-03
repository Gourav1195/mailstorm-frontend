import React from "react";
import { 
  Dialog, 
  Typography, 
  IconButton, 
  Box, 
  Card,
  Chip,
  Avatar,
  Divider, 
  Button
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SmsIcon from '@mui/icons-material/Sms';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDesignSystem } from "../../design/theme";

type SMSPreviewProps = {
  open: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
  name?: string;
  subject?: string;
  message?: string;
  includeOptOut?: boolean;
  mode?: 'light' | 'dark';
};

const SMSPreview: React.FC<SMSPreviewProps> = ({ 
  open, 
  handleClose, 
  handleConfirm, 
  name, 
  subject, 
  message, 
  includeOptOut,
  mode = 'light'
}) => {
  const designSystem = useDesignSystem(mode);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message || '');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
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
      {/* Header */}
      <Box
        sx={{
          background: designSystem.colors.gradientPrimary,
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
            animation: 'shimmer 2s infinite',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <SmsIcon sx={{ color: 'white' }} />
          </Avatar>
          <Box>
            <Typography sx={{ 
              color: 'white', 
              fontWeight: 600,
              fontSize: '1.1rem',
            }}>
              {name || 'SMS Preview'}
            </Typography>
            {subject && (
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.8rem',
                mt: 0.25,
              }}>
                Subject: {subject}
              </Typography>
            )}
          </Box>
        </Box>
        
        <IconButton 
          onClick={handleClose}
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Card
          sx={{
            backgroundColor: designSystem.colors.surfaceElevated,
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.lg,
            p: 3,
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: designSystem.colors.gradientPrimary,
          }} />
          
          <Typography variant="body2" sx={{ 
            color: designSystem.colors.textPrimary,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            fontSize: '0.95rem',
          }}>
            {message || 'No message content available.'}
          </Typography>
        </Card>

        {/* Message Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="SMS"
              size="small"
              sx={{
                backgroundColor: designSystem.colors.primaryBg,
                color: designSystem.colors.primary,
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary }}>
              {message?.length || 0} characters
            </Typography>
          </Box>
          
          <IconButton
            size="small"
            onClick={copyToClipboard}
            sx={{
              color: designSystem.colors.textTertiary,
              '&:hover': {
                color: designSystem.colors.primary,
                backgroundColor: designSystem.colors.primaryBg,
              }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>

        {includeOptOut && (
          <Box sx={{ 
            mt: 2,
            p: 2,
            backgroundColor: designSystem.colors.surfaceElevated,
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.md,
            borderLeft: `4px solid ${designSystem.colors.warning}`,
          }}>
            <Typography variant="caption" sx={{ 
              color: designSystem.colors.warning,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}>
              ⚠️ Important
            </Typography>
            <Typography variant="caption" sx={{ 
              color: designSystem.colors.textSecondary,
              display: 'block',
              mt: 0.5,
            }}>
              "Reply STOP to unsubscribe"
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Divider sx={{ borderColor: designSystem.colors.border }} />
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 1,
      }}>
        <Button
          onClick={handleClose}
          sx={{
            color: designSystem.colors.textSecondary,
            '&:hover': {
              backgroundColor: designSystem.colors.hoverSecondary,
            }
          }}
        >
          Close
        </Button>
        {handleConfirm && (
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              background: designSystem.colors.gradientPrimary,
              '&:hover': {
                opacity: 0.9,
              }
            }}
          >
            Send Test
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default SMSPreview;