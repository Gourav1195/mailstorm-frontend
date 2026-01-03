import React from "react";
import {
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Badge,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import BoltIcon from '@mui/icons-material/Bolt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { CriteriaBlockUI } from "../../../src/types/filter";
import DraggableItem from "./DraggableItem";
import { useDesignSystem } from "../../design/theme";

interface CriteriaBlockPanelProps {
  activeTab: string;
  criteriaTabs: Record<string, CriteriaBlockUI[]>;
  searchTerm: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  onSearchChange: (value: string) => void;
  onAddCustomField: (tab: string) => void;
  mode: 'light' | 'dark';
}

const CriteriaBlockPanel: React.FC<CriteriaBlockPanelProps> = ({
  mode,
  activeTab,
  criteriaTabs,
  searchTerm,
  onTabChange,
  onSearchChange,
  onAddCustomField,
}) => {
  const designSystem = useDesignSystem(mode);
  const tabLabels = ["Filter Components", "Trigger Filters"];
  const tabIcons = [<FilterListIcon key="filter" />, <BoltIcon key="bolt" />];

  const filteredCriteria = criteriaTabs[activeTab]?.filter((criteria: any) =>
    typeof criteria.label === "string" &&
    criteria.label.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTabStats = (tab: string) => {
    const criteria = criteriaTabs[tab] || [];
    const stringCount = criteria.filter(c => c.dataType === "string").length;
    const numberCount = criteria.filter(c => c.dataType === "number").length;
    const dateCount = criteria.filter(c => c.dataType === "date").length;
    const booleanCount = criteria.filter(c => c.dataType === "boolean").length;
    
    return { stringCount, numberCount, dateCount, booleanCount };
  };

  const stats = getTabStats(activeTab);

  return (
    <Card sx={{ 
      p: 2.5,
      width: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: designSystem.colors.surface,
      borderRadius: designSystem.effects.borderRadius.lg,
      border: `1px solid ${designSystem.colors.border}`,
      boxShadow: designSystem.effects.shadows.default,
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ 
          color: designSystem.colors.textPrimary,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <Box sx={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: designSystem.colors.gradientPrimary,
            borderRadius: designSystem.effects.borderRadius.md,
            boxShadow: designSystem.effects.shadows.glow,
          }}>
            <FilterListIcon sx={{ color: designSystem.colors.textInverse }} />
          </Box>
          Field Library
        </Typography>
        <Tooltip title="Drag and drop fields to build filters">
          <IconButton size="small">
            <HelpOutlineIcon sx={{ color: designSystem.colors.textTertiary }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: designSystem.colors.border, mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              color: designSystem.colors.textTertiary,
              minHeight: 48,
              textTransform: 'none',
              '&.Mui-selected': {
                color: designSystem.colors.primary,
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              background: designSystem.colors.gradientPrimary,
              height: 3,
              borderRadius: designSystem.effects.borderRadius.full,
            }
          }}
        >
          {Object.keys(criteriaTabs).map((tab, index) => (
            <Tab
              key={tab}
              icon={tabIcons[index]}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {tabLabels[index]}
                  <Badge
                    badgeContent={criteriaTabs[tab]?.length || 0}
                    color="primary"
                    sx={{
                      ml: 1,
                      '& .MuiBadge-badge': {
                        backgroundColor: designSystem.colors.primary,
                        color: designSystem.colors.textInverse,
                        fontSize: '0.6rem',
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  />
                </Box>
              }
              value={tab}
            />
          ))}
        </Tabs>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search fields..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: designSystem.colors.textTertiary }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: designSystem.colors.surfaceElevated,
              borderRadius: designSystem.effects.borderRadius.md,
              '& fieldset': {
                borderColor: designSystem.colors.border,
              },
              '&:hover fieldset': {
                borderColor: designSystem.colors.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: designSystem.colors.primary,
              }
            }
          }}
        />
      </Box>

      {/* Data Type Stats */}
      {filteredCriteria.length > 0 && (
        <Box sx={{ 
          mb: 2, 
          p: 1.5, 
          backgroundColor: designSystem.colors.surfaceElevated,
          borderRadius: designSystem.effects.borderRadius.md,
          border: `1px solid ${designSystem.colors.border}`,
        }}>
          <Typography variant="caption" sx={{ 
            color: designSystem.colors.textSecondary,
            display: 'block',
            mb: 1,
            fontWeight: 500,
          }}>
            Field Types
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {stats.stringCount > 0 && (
              <Chip
                icon={<SearchIcon />}
                label={`${stats.stringCount} Text`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: designSystem.colors.primary,
                  color: designSystem.colors.primary,
                  '& .MuiChip-icon': {
                    color: designSystem.colors.primary,
                  }
                }}
              />
            )}
            {stats.numberCount > 0 && (
              <Chip
                icon={<span>#</span>}
                label={`${stats.numberCount} Number`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: designSystem.colors.success,
                  color: designSystem.colors.success,
                }}
              />
            )}
            {stats.dateCount > 0 && (
              <Chip
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke={designSystem.colors.accent} strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke={designSystem.colors.accent} strokeWidth="2" strokeLinecap="round"/><path d="M3 9h18" stroke={designSystem.colors.accent} strokeWidth="2"/></svg>}
              label={`${stats.dateCount} Date`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: designSystem.colors.accent,
                color: designSystem.colors.accent,
                '& .MuiChip-icon': {
                color: designSystem.colors.accent,
                }
              }}
              />
            )}
            {stats.booleanCount > 0 && (
              <Chip
                icon={<span>✓</span>}
                label={`${stats.booleanCount} Boolean`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: designSystem.colors.warning,
                  color: designSystem.colors.warning,
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Criteria Blocks */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ 
          mb: 1.5, 
          color: designSystem.colors.textPrimary,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}>
          Available Fields
          <Typography variant="caption" sx={{ 
            color: designSystem.colors.textTertiary,
            fontWeight: 400,
          }}>
            ({filteredCriteria.length})
          </Typography>
        </Typography>

        {filteredCriteria.length === 0 ? (
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center',
          }}>
            <SearchIcon sx={{ 
              fontSize: 48, 
              color: designSystem.colors.textTertiary,
              mb: 2,
              opacity: 0.5,
            }} />
            <Typography variant="body2" sx={{ 
              color: designSystem.colors.textSecondary,
              mb: 0.5,
            }}>
              No fields found
            </Typography>
            <Typography variant="caption" sx={{ 
              color: designSystem.colors.textTertiary,
            }}>
              Try a different search term
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: designSystem.colors.surfaceElevated,
              borderRadius: designSystem.effects.borderRadius.sm,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: designSystem.colors.border,
              borderRadius: designSystem.effects.borderRadius.sm,
              '&:hover': {
                backgroundColor: designSystem.colors.textTertiary,
              }
            },
            maxHeight: '300px',
          }}>
            {filteredCriteria.map((criteria: any, index: number) => (
              <React.Fragment key={criteria.label}>
                {index > 0 && (
                  <Divider 
                    sx={{ 
                      borderColor: designSystem.colors.border, 
                      my: 1,
                      opacity: 0.3,
                    }} 
                  />
                )}
                <DraggableItem criteria={criteria} mode={mode} />
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>

      {/* Add Custom Field Button */}
      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${designSystem.colors.border}` }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onAddCustomField(activeTab)}
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            borderColor: designSystem.colors.border,
            color: designSystem.colors.primary,
            fontWeight: 600,
            textTransform: 'none',
            py: 1,
            '&:hover': {
              borderColor: designSystem.colors.primary,
              backgroundColor: designSystem.colors.primaryBg,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Add Custom Field
        </Button>
        <Typography variant="caption" sx={{ 
          color: designSystem.colors.textTertiary,
          display: 'block',
          textAlign: 'center',
          mt: 1,
        }}>
          Create custom criteria for your needs
        </Typography>
      </Box>
    </Card>
  );
};

export default CriteriaBlockPanel;