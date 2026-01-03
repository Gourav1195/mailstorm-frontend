import React from "react";
import { Box, Card, Typography, Avatar, LinearProgress } from "@mui/material";
import { useDesignSystem } from "../../design/theme";
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface FilterSummaryProps {
  estimatedAudience: number;
  mode: 'light' | 'dark';
  previousAudience?: number;
}

const FilterSummary: React.FC<FilterSummaryProps> = ({ 
  estimatedAudience, 
  mode,
  previousAudience 
}) => {
  const designSystem = useDesignSystem(mode);
  const percentageChange = previousAudience 
    ? ((estimatedAudience - previousAudience) / previousAudience) * 100 
    : null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card sx={{ 
      maxHeight: '80vh',
      p: 2.5,
      backgroundColor: designSystem.colors.surface,
      borderRadius: designSystem.effects.borderRadius.lg,
      border: `1px solid ${designSystem.colors.border}`,
      boxShadow: designSystem.effects.shadows.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: designSystem.effects.shadows.md,
        transform: 'translateY(-2px)',
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" sx={{ 
          color: designSystem.colors.textPrimary,
          fontWeight: 600,
          background: designSystem.colors.gradientPrimary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Filter Summary
        </Typography>
        
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: designSystem.colors.gradientPrimary,
            boxShadow: designSystem.effects.shadows.glow,
          }}
        >
          <PeopleIcon sx={{ color: designSystem.colors.textInverse }} />
        </Avatar>
      </Box>

      <Typography variant="subtitle2" sx={{ 
        mb: 2.5, 
        color: designSystem.colors.textSecondary,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}>
        Preview your filtered audience
      </Typography>

      <Box sx={{ 
        backgroundColor: designSystem.colors.surfaceElevated,
        borderRadius: designSystem.effects.borderRadius.md,
        p: 2,
        border: `1px solid ${designSystem.colors.border}`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ 
              color: designSystem.colors.textSecondary,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            Estimated Audience
          </Typography>
          
          {percentageChange !== null && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: percentageChange >= 0 ? designSystem.colors.success : designSystem.colors.error,
            }}>
              {percentageChange >= 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16 }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: 0.5,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              background: designSystem.colors.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            {formatNumber(estimatedAudience)}
          </Typography>
          <Typography 
            sx={{ 
              color: designSystem.colors.textTertiary,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            people
          </Typography>
        </Box>

        {previousAudience && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: designSystem.colors.textTertiary,
              display: 'block',
              mt: 0.5,
            }}
          >
            Previous: {formatNumber(previousAudience)}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary }}>
              Audience Reach
            </Typography>
            <Typography variant="caption" sx={{ 
              color: designSystem.colors.textPrimary,
              fontWeight: 600,
            }}>
              {((estimatedAudience / 10000000) * 100).toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((estimatedAudience / 10000000) * 100, 100)}
            sx={{
              height: 6,
              borderRadius: designSystem.effects.borderRadius.full,
              backgroundColor: designSystem.colors.surfaceHighlight,
              '& .MuiLinearProgress-bar': {
                background: designSystem.colors.gradientSuccess,
                borderRadius: designSystem.effects.borderRadius.full,
              }
            }}
          />
        </Box>
      </Box>

      {estimatedAudience > 0 && (
        <Box sx={{ 
          mt: 2, 
          p: 1.5, 
          backgroundColor: designSystem.colors.surfaceElevated,
          borderRadius: designSystem.effects.borderRadius.sm,
          border: `1px solid ${designSystem.colors.border}`,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: designSystem.colors.textSecondary }}>
              Potential Engagement
            </Typography>
            <Typography variant="caption" sx={{ 
              color: designSystem.colors.success,
              fontWeight: 600,
            }}>
              High
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ 
            color: designSystem.colors.textTertiary,
            display: 'block',
            mt: 0.5,
          }}>
            {Math.round(estimatedAudience * 0.15).toLocaleString()} expected opens
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default FilterSummary;