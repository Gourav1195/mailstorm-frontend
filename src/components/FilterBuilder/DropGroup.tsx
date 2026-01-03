import React from "react";
import { useDrop } from "react-dnd";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FunctionsIcon from '@mui/icons-material/Functions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useDesignSystem } from "../../design/theme";
import { AppliedCriteria } from "../../types/filter";
import { operatorLabels } from "./constants";
const ItemType = "CRITERIA";

// interface AppliedCriteria {
//   key: string;
//   label: string;
//   dataType: string;
//   operator: string;
//   value: string;
//   availableOperators: string[];
// }

interface DropGroupProps {
  mode: 'light' | 'dark';
  groupId: number;
  items: AppliedCriteria[];
  onDrop: (criteria: any, groupId: number) => void;
  onRemove: (criteriaLabel: string, groupId: number) => void;
  onUpdate: (
    criteriaLabel: string,
    groupId: number,
    field: keyof AppliedCriteria,
    value: string
  ) => void;
}

const getDataTypeIcon = (dataType: string) => {
  switch (dataType) {
    case "string": return <TextFieldsIcon fontSize="small" />;
    case "number": return <FunctionsIcon fontSize="small" />;
    case "date": return <CalendarTodayIcon fontSize="small" />;
    default: return <TextFieldsIcon fontSize="small" />;
  }
};

const getDataTypeColor = (dataType: string, designSystem: any) => {
  switch (dataType) {
    case "string": return designSystem.colors.primary;
    case "number": return designSystem.colors.success;
    case "date": return designSystem.colors.accent;
    default: return designSystem.colors.textSecondary;
  }
};

const DropGroup: React.FC<DropGroupProps> = ({
  groupId,
  items,
  onDrop,
  onRemove,
  onUpdate,
  mode,
}) => {
  const designSystem = useDesignSystem(mode);
  
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: { criteria: any }) => {
      onDrop(item.criteria, groupId);
    },
  });
  
  const safeItems = Array.isArray(items) ? items : [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      ref={drop as any}
      sx={{
        minHeight: safeItems.length === 0 ? 200 : 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
      onDragOver={handleDragOver}
    >
      {safeItems.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${designSystem.colors.border}`,
            backgroundColor: designSystem.colors.surface,
            borderRadius: designSystem.effects.borderRadius.lg,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: designSystem.colors.primary,
              backgroundColor: designSystem.colors.primaryBg,
              transform: 'translateY(-1px)',
            }
          }}
        >
          <Box sx={{
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: designSystem.colors.surfaceElevated,
            borderRadius: '50%',
            mb: 2,
            border: `2px solid ${designSystem.colors.border}`,
          }}>
            <DragIndicatorIcon sx={{ 
              fontSize: 32, 
              color: designSystem.colors.textTertiary 
            }} />
          </Box>
          <Typography variant="h6" sx={{ 
            color: designSystem.colors.textPrimary,
            mb: 1,
            fontWeight: 600,
          }}>
            No Conditions Added
          </Typography>
          <Typography variant="body2" sx={{ 
            color: designSystem.colors.textSecondary,
            mb: 0.5,
            textAlign: 'center',
            maxWidth: 300,
          }}>
            Drag and drop fields from the left panel
          </Typography>
          <Typography variant="caption" sx={{ 
            color: designSystem.colors.textTertiary,
            textAlign: 'center',
            maxWidth: 300,
          }}>
            Or click on a field to add it automatically
          </Typography>
        </Paper>
      ) : (
        safeItems.map((item, index) => {
          const dataTypeColor = getDataTypeColor(item.dataType, designSystem);
          return (
            <Paper
              key={`${item.label}-${index}`}
              sx={{
                p: 1.2,
                backgroundColor: designSystem.colors.surfaceElevated,
                border: `1px solid ${designSystem.colors.border}`,
                borderRadius: designSystem.effects.borderRadius.md,
                boxShadow: designSystem.effects.shadows.xs,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: designSystem.effects.shadows.sm,
                  borderColor: designSystem.colors.primary,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: `${dataTypeColor}15`,
                    borderRadius: designSystem.effects.borderRadius.sm,
                    color: dataTypeColor,
                  }}>
                    {getDataTypeIcon(item.dataType)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      color: designSystem.colors.textPrimary,
                      fontWeight: 600,
                    }}>
                      {item.label} &nbsp;

                       <Typography variant="caption" sx={{ 
                      color: designSystem.colors.textTertiary,
                    }}>
                      {item.dataType.charAt(0).toUpperCase() + item.dataType.slice(1)} field
                    </Typography>
                    </Typography>
                   
                  </Box>
                </Box>
                
                <Tooltip title="Remove condition">
                  <IconButton
                    size="small"
                    onClick={() => onRemove(item.label, groupId)}
                    sx={{
                      color: designSystem.colors.textTertiary,
                      backgroundColor: designSystem.colors.errorBg,
                      '&:hover': {
                        color: designSystem.colors.error,
                        backgroundColor: `${designSystem.colors.error}20`,
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: designSystem.colors.textSecondary,
                    display: 'block',
                    mb: 0.5,
                    fontWeight: 500,
                  }}>
                    Operator
                  </Typography>
                  <Select
                    value={item.operator || ""}
                    onChange={(e) => onUpdate(item.label, groupId, "operator", e.target.value)}
                    size="small"
                    fullWidth
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          label={operatorLabels[selected as string] || selected}
                          size="small"
                          sx={{
                            backgroundColor: designSystem.colors.primaryBg,
                            color: designSystem.colors.primary,
                            fontWeight: 500,
                            height: 20,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    )}
                    sx={{
                      '& .MuiSelect-select': {
                        color: designSystem.colors.textPrimary,
                        padding: '6px 12px',
                      },
                      '& fieldset': {
                        borderColor: designSystem.colors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: designSystem.colors.primary,
                      },
                    }}
                  >
                    {item.availableOperators.map((op: string) => (
                      <MenuItem 
                        key={op} 
                        value={op}
                        sx={{ 
                          color: designSystem.colors.textPrimary,
                          '&:hover': {
                            backgroundColor: designSystem.colors.hover,
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={operatorLabels[op] || op}
                            size="small"
                            sx={{
                              backgroundColor: designSystem.colors.surfaceElevated,
                              color: designSystem.colors.textPrimary,
                              fontWeight: 400,
                              height: 20,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ 
                    color: designSystem.colors.textSecondary,
                    display: 'block',
                    mb: 0.5,
                    fontWeight: 500,
                  }}>
                    Value
                  </Typography>
                  {item.dataType === "string" ? (
                    <TextField
                      size="small"
                      value={item.value}
                      onChange={(e) =>
                        onUpdate(item.label, groupId, "value", e.target.value)
                      }
                      placeholder="Enter text"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          color: designSystem.colors.textPrimary,
                          padding: '6px 12px',
                        },
                        '& fieldset': {
                          borderColor: designSystem.colors.border,
                        },
                        '&:hover fieldset': {
                          borderColor: designSystem.colors.primary,
                        },
                      }}
                    />
                  ) : item.dataType === "date" ? (
                    <TextField
                      type="date"
                      size="small"
                      value={item.value}
                      onChange={(e) =>
                        onUpdate(item.label, groupId, "value", e.target.value)
                      }
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          color: designSystem.colors.textPrimary,
                          padding: '6px 12px',
                        },
                        '& fieldset': {
                          borderColor: designSystem.colors.border,
                        },
                        '&:hover fieldset': {
                          borderColor: designSystem.colors.primary,
                        },
                      }}
                    />
                  ) : (
                    <TextField
                      type="number"
                      size="small"
                      value={item.value}
                      onChange={(e) =>
                        onUpdate(item.label, groupId, "value", e.target.value)
                      }
                      placeholder="Enter number"
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          color: designSystem.colors.textPrimary,
                          padding: '6px 12px',
                        },
                        '& fieldset': {
                          borderColor: designSystem.colors.border,
                        },
                        '&:hover fieldset': {
                          borderColor: designSystem.colors.primary,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default DropGroup;