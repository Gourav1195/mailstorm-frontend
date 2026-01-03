import React from "react";
import { useDrag } from "react-dnd";
import { 
  Box, 
  Typography, 
  Chip, 
  Avatar,
  Tooltip 
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FunctionsIcon from '@mui/icons-material/Functions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NumbersIcon from '@mui/icons-material/Numbers';
import { CriteriaBlockUI } from "../../types/filter";
import { useDesignSystem } from "../../design/theme";

const ItemType = "CRITERIA";

interface DraggableItemProps {
  criteria: CriteriaBlockUI;
  mode: 'light' | 'dark';
}

const DraggableItem: React.FC<DraggableItemProps> = ({ criteria, mode }) => {
  const designSystem = useDesignSystem(mode);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { criteria: { ...criteria } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case "string": return <TextFieldsIcon fontSize="small" />;
      case "number": return <NumbersIcon fontSize="small" />;
      case "date": return <CalendarTodayIcon fontSize="small" />;
      case "boolean": return <ChecklistIcon fontSize="small" />;
      case "integer": return <FunctionsIcon fontSize="small" />;
      default: return <TextFieldsIcon fontSize="small" />;
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case "string": return designSystem.colors.primary;
      case "number": return designSystem.colors.success;
      case "date": return designSystem.colors.accent;
      case "boolean": return designSystem.colors.warning;
      case "integer": return designSystem.colors.info;
      default: return designSystem.colors.textSecondary;
    }
  };

  const dataTypeColor = getDataTypeColor(criteria.dataType);
  
  // Enhanced hover colors based on mode
  const hoverStyles = mode === 'dark' ? {
    backgroundColor: designSystem.colors.hoverSecondary,
    borderColor: dataTypeColor,
    boxShadow: `0 4px 20px ${dataTypeColor}20`,
    transform: 'translateY(-3px) scale(1.01)',
    '& .MuiAvatar-root': {
      backgroundColor: `${dataTypeColor}30`,
      transform: 'scale(1.1)',
    },
    '& .MuiChip-root': {
      backgroundColor: `${dataTypeColor}25`,
      borderColor: dataTypeColor,
    },
    '& .MuiSvgIcon-root': {
      color: dataTypeColor,
    }
  } : {
    backgroundColor: designSystem.colors.hover,
    borderColor: dataTypeColor,
    boxShadow: `0 4px 16px ${dataTypeColor}15`,
    transform: 'translateY(-3px) scale(1.01)',
    '& .MuiAvatar-root': {
      backgroundColor: `${dataTypeColor}20`,
      transform: 'scale(1.1)',
    },
    '& .MuiChip-root': {
      backgroundColor: `${dataTypeColor}15`,
      borderColor: dataTypeColor,
    },
    '& .MuiSvgIcon-root': {
      color: dataTypeColor,
    }
  };

  return (
    <Tooltip 
      title={`Drag "${criteria.label}" to filter canvas`}
      arrow
      placement="right"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: designSystem.colors.surface,
            color: designSystem.colors.textPrimary,
            border: `1px solid ${designSystem.colors.border}`,
            boxShadow: designSystem.effects.shadows.md,
            fontSize: '0.75rem',
          }
        }
      }}
    >
      <Box
        ref={drag as any}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
          p: 2,
          border: `1px solid ${designSystem.colors.border}`,
          borderRadius: designSystem.effects.borderRadius.lg,
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: designSystem.colors.surface,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': hoverStyles,
          '&:active': {
            cursor: 'grabbing',
            transform: 'translateY(-1px) scale(0.99)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${dataTypeColor}, transparent)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 0.3,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: `${dataTypeColor}15`,
              color: dataTypeColor,
              transition: 'all 0.3s ease',
              border: `1px solid ${dataTypeColor}30`,
            }}
          >
            {getDataTypeIcon(criteria.dataType)}
          </Avatar>
          
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: designSystem.colors.textPrimary,
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 0.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {criteria.label}
            </Typography>
            {/* {criteria.description && (
              <Typography
                variant="caption"
                sx={{
                  color: designSystem.colors.textTertiary,
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                }}
              >
                {criteria.description}
              </Typography>
            )} */}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 1 }}>
          <Chip
            label={criteria.dataType}
            size="small"
            sx={{
              backgroundColor: `${dataTypeColor}10`,
              color: dataTypeColor,
              fontWeight: 600,
              fontSize: '0.65rem',
              height: 22,
              border: `1px solid ${dataTypeColor}30`,
              transition: 'all 0.3s ease',
            }}
          />
          
          <DragIndicator 
            sx={{ 
              color: designSystem.colors.textTertiary,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: dataTypeColor,
              }
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default DraggableItem;