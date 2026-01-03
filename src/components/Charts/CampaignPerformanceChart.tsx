import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, styled } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MonthlyStat } from 'types/dashboard';
import { DESIGN_SYSTEM } from 'design/theme';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import TimeFrameButtonGroup from './TimeFrameButtonGroup';
import TimeFrameButton from './TimeFrameButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Theme-aware styled components
const ChartContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surface,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.lg,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
  boxShadow: DESIGN_SYSTEM.effects.shadows[mode].sm,
  transition: DESIGN_SYSTEM.effects.transitions.normal,
  '&:hover': {
    boxShadow: DESIGN_SYSTEM.effects.shadows[mode].md,
  },
}));

const ChartHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: DESIGN_SYSTEM.spacing.lg,
  flexWrap: 'wrap',
  gap: DESIGN_SYSTEM.spacing.md,
});

const ChartTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.h4.fontSize,
  fontWeight: DESIGN_SYSTEM.typography.scale.h4.fontWeight,
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  lineHeight: DESIGN_SYSTEM.typography.scale.h4.lineHeight,
}));

const ChartSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  marginTop: DESIGN_SYSTEM.spacing.xs,
}));

const ChartCanvas = styled(Box)({
  width: '100%',
  height: '320px',
  position: 'relative',
  '@media (min-width: 900px)': {
    height: '380px',
  },
});

const EmptyState = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '320px',
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  textAlign: 'center',
  padding: DESIGN_SYSTEM.spacing.xl,
}));

interface CampaignPerformanceChartProps {
  stats?: MonthlyStat[];
}

const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({ stats }) => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const timeFrames = ['daily', 'weekly', 'monthly'] as const;
  
  const mode = useSelector((state: RootState) => state.theme.mode);
  const colors = DESIGN_SYSTEM.modes[mode].colors;
  const shadows = DESIGN_SYSTEM.effects.shadows[mode];

  if (!stats || stats.length === 0) {
    return (
      <ChartContainer mode={mode}>
        <CardContent>
          <EmptyState mode={mode}>
            <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
              No Campaign Data
            </Typography>
            <Typography variant="body2">
              Campaign performance data will appear here once available
            </Typography>
          </EmptyState>
        </CardContent>
      </ChartContainer>
    );
  }

  const labels = stats.map((stat) => stat.month);
  const clickRates = stats.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalClick = campaigns.reduce((sum, c) => sum + c.clickRate, 0);
    return Math.round(totalClick / campaigns.length);
  });

  const openRates = stats.map((stat) => {
    const campaigns = stat[timeFrame]?.campaigns || [];
    if (campaigns.length === 0) return 0;
    const totalOpen = campaigns.reduce((sum, c) => sum + c.openRate, 0);
    return Math.round(totalOpen / campaigns.length);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Open Rate',
        data: openRates,
        borderColor: colors.chart1,
        backgroundColor: colors.primaryBg,
        pointBackgroundColor: colors.chart1,
        pointBorderColor: colors.surface,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Click Rate',
        data: clickRates,
        borderColor: colors.chart2,
        backgroundColor: colors.secondaryBg,
        pointBackgroundColor: colors.chart2,
        pointBorderColor: colors.surface,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: colors.textPrimary,
          font: {
            family: DESIGN_SYSTEM.typography.fontFamily,
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: colors.surfaceElevated,
        titleColor: colors.textPrimary,
        bodyColor: colors.textSecondary,
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: shadows.sm,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.divider,
          drawBorder: false,
        },
        ticks: {
          color: colors.textSecondary,
          font: {
            family: DESIGN_SYSTEM.typography.fontFamily,
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: colors.divider,
          drawBorder: false,
        },
        ticks: {
          color: colors.textSecondary,
          stepSize: 20,
          font: {
            family: DESIGN_SYSTEM.typography.fontFamily,
            size: 11,
          },
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const totalOpenRate = openRates.reduce((a, b) => a + b, 0) / openRates.length;
  const totalClickRate = clickRates.reduce((a, b) => a + b, 0) / clickRates.length;

  return (
    <ChartContainer mode={mode}>
      <CardContent>
        <ChartHeader>
          <Box>
            <ChartTitle mode={mode}>
              Campaign Performance
            </ChartTitle>
            <ChartSubtitle mode={mode}>
              Avg. Open Rate: {totalOpenRate.toFixed(1)}% • Avg. Click Rate: {totalClickRate.toFixed(1)}%
            </ChartSubtitle>
          </Box>
          
          <TimeFrameButtonGroup mode={mode}>
            {timeFrames.map((frame) => (
              <TimeFrameButton
                key={frame}
                mode={mode}
                active={timeFrame === frame}
                onClick={() => setTimeFrame(frame)}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </TimeFrameButton>
            ))}
          </TimeFrameButtonGroup>
        </ChartHeader>

        <ChartCanvas>
          <Line data={data} options={options} />
        </ChartCanvas>
      </CardContent>
    </ChartContainer>
  );
};

export default CampaignPerformanceChart;