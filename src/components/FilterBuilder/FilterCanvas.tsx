import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import FilterAlt from "@mui/icons-material/FilterAlt";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DropGroup from "./DropGroup";
import { useDesignSystem } from "../../design/theme";

interface AppliedCriteria {
  key: string;
  label: string;
  dataType: string;
  operator: string;
  value: string;
  availableOperators: string[];
}

interface FilterCanvasProps {
  activeTab: string;
  groupsByTab: { [tab: string]: any[] };
  groupOperatorsByTab: { [tab: string]: { [groupId: number]: string } };
  logicalOperatorsByTab: { [tab: string]: { [index: number]: "AND" | "OR" } };
  onAddGroup: () => void;
  onDeleteGroup: (groupId: number) => void;
  onDrop: (criteria: any, groupId: number) => void;
  onRemoveItem: (criteriaLabel: string, groupId: number) => void;
  onUpdateItem: (
    criteriaLabel: string,
    groupId: number,
    field: keyof AppliedCriteria,
    value: string
  ) => void;
  onGroupOperatorChange: (groupId: number, value: string) => void;
  onLogicalOperatorChange: (index: number, value: "AND" | "OR") => void;
  mode: 'light' | 'dark';
}

const FilterCanvas: React.FC<FilterCanvasProps> = ({
  mode,
  activeTab,
  groupsByTab,
  groupOperatorsByTab,
  logicalOperatorsByTab,
  onAddGroup,
  onDeleteGroup,
  onDrop,
  onRemoveItem,
  onUpdateItem,
  onGroupOperatorChange,
  onLogicalOperatorChange,
}) => {
  const designSystem = useDesignSystem(mode);
  const currentGroups = groupsByTab[activeTab] || [];

  return (
    <Box sx={{ width: {xs:'100%', lg:'40%'}, maxWidth: 800 }}>
      <Card sx={{ 
        p: 2.5,
        backgroundColor: designSystem.colors.surface,
        borderRadius: designSystem.effects.borderRadius.lg,
        border: `1px solid ${designSystem.colors.border}`,
        minHeight: 400,
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAlt sx={{ color: designSystem.colors.primary, fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>
              Filter Builder
            </Typography>
            {currentGroups.length > 0 && (
              <Box sx={{ 
                ml: 1, 
                px: 1, 
                py: 0.25, 
                backgroundColor: designSystem.colors.primaryBg,
                borderRadius: 10,
                fontSize: '0.75rem',
                color: designSystem.colors.primary,
                fontWeight: 500,
              }}>
                {currentGroups.length} group{currentGroups.length > 1 ? 's' : ''}
              </Box>
            )}
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddGroup}
            sx={{
              borderColor: designSystem.colors.border,
              color: designSystem.colors.primary,
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Add Group
          </Button>
        </Box>

        {/* Empty State */}
        {currentGroups.length === 0 ? (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            textAlign: 'center',
          }}>
            <Box sx={{
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: designSystem.colors.surfaceElevated,
              borderRadius: '50%',
              mb: 2,
            }}>
              <FilterAlt sx={{ fontSize: 28, color: designSystem.colors.textTertiary }} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: designSystem.colors.textPrimary, mb: 1 }}>
              No filter groups yet
            </Typography>
            <Typography variant="body2" sx={{ color: designSystem.colors.textSecondary, mb: 2 }}>
              Start by adding your first filter group
            </Typography>
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              onClick={onAddGroup}
              sx={{
                backgroundColor: designSystem.colors.primary,
                '&:hover': {
                  backgroundColor: designSystem.colors.primaryDark,
                },
              }}
            >
              Create First Group
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {currentGroups.map((group, index) => (
              <React.Fragment key={group.id}>
                {/* Logical Operator Between Groups */}
                {index > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Select
                      value={logicalOperatorsByTab[activeTab]?.[index] || "OR"}
                      onChange={(e) =>
                        onLogicalOperatorChange(index, e.target.value as "AND" | "OR")
                      }
                      size="small"
                      sx={{
                        color: designSystem.colors.textPrimary,
                        fontSize: '0.75rem',
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1.5,
                        },
                        '& fieldset': {
                          borderColor: designSystem.colors.border,
                        },
                      }}
                    >
                      <MenuItem value="AND">AND (All groups)</MenuItem>
                      <MenuItem value="OR">OR (Any group)</MenuItem>
                    </Select>
                  </Box>
                )}

                {/* Group Card */}
                <Box sx={{ 
                  border: `1px solid ${designSystem.colors.border}`,
                  borderRadius: designSystem.effects.borderRadius.md,
                  overflow: 'hidden',
                }}>
                  {/* Group Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    backgroundColor: designSystem.colors.surfaceElevated,
                    borderBottom: `1px solid ${designSystem.colors.border}`,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>
                        Group {index + 1}
                      </Typography>
                      
                      <Select
                        value={groupOperatorsByTab[activeTab]?.[group.id] || "AND"}
                        onChange={(e) => onGroupOperatorChange(group.id, e.target.value)}
                        size="small"
                        sx={{
                          color: designSystem.colors.textPrimary,
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            py: 0.25,
                            px: 1,
                          },
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                          '&:hover fieldset': {
                            borderColor: designSystem.colors.border,
                          },
                        }}
                      >
                        <MenuItem value="AND">AND  (All conditions)</MenuItem>
                        <MenuItem value="OR">OR  (Any condition)</MenuItem>
                      </Select>
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={() => onDeleteGroup(group.id)}
                      sx={{ color: designSystem.colors.textTertiary }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Drop Area */}
                  <Box sx={{ p: 2 }}>
                    <DropGroup
                      groupId={group.id}
                      items={group.criteria}
                      onDrop={onDrop}
                      onRemove={onRemoveItem}
                      onUpdate={onUpdateItem}
                      mode={mode}
                    />
                  </Box>
                </Box>
              </React.Fragment>
            ))}

            {/* Add Another Group Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={onAddGroup}
                sx={{
                  color: designSystem.colors.primary,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Add Another Group
              </Button>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default FilterCanvas;