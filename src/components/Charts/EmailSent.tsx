import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Box, Typography, styled } from '@mui/material';
import { MonthlyStat } from 'types/dashboard';
import { DESIGN_SYSTEM } from 'design/theme';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import TimeFrameButtonGroup from './TimeFrameButtonGroup';
import TimeFrameButton from './TimeFrameButton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Theme-aware styled components
const EmailChartContainer = styled(Card, {
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

const EmailChartHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: DESIGN_SYSTEM.spacing.lg,
  flexWrap: 'wrap',
  gap: DESIGN_SYSTEM.spacing.md,
});

const EmailChartTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.h4.fontSize,
  fontWeight: DESIGN_SYSTEM.typography.scale.h4.fontWeight,
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  lineHeight: DESIGN_SYSTEM.typography.scale.h4.lineHeight,
}));

const EmailChartSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  marginTop: DESIGN_SYSTEM.spacing.xs,
}));

const EmailChartCanvas = styled(Box)({
  width: '100%',
  height: '320px',
  position: 'relative',
  '@media (min-width: 900px)': {
    height: '380px',
  },
});

const MetricSummary = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  display: 'flex',
  gap: DESIGN_SYSTEM.spacing.lg,
  marginTop: DESIGN_SYSTEM.spacing.md,
  padding: DESIGN_SYSTEM.spacing.md,
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surfaceElevated,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.md,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
}));

const MetricItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: DESIGN_SYSTEM.spacing.xs,
});

interface EmailSentProps {
  data?: MonthlyStat[];
}

const EmailSent: React.FC<EmailSentProps> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const timeFrames = ['daily', 'weekly', 'monthly'] as const;
  
  const mode = useSelector((state: RootState) => state.theme.mode);
  const colors = DESIGN_SYSTEM.modes[mode].colors;
  const shadows = DESIGN_SYSTEM.effects.shadows[mode];

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = data.map((stat) => stat.month);
    const clickRates = data.map((stat) => {
      const campaigns = stat[timeFrame]?.campaigns || [];
      if (campaigns.length === 0) return 0;
      const totalClick = campaigns.reduce((sum, c) => sum + c.clickRate, 0);
      return Math.round(totalClick / campaigns.length);
    });

    const openRates = data.map((stat) => {
      const campaigns = stat[timeFrame]?.campaigns || [];
      if (campaigns.length === 0) return 0;
      const totalOpen = campaigns.reduce((sum, c) => sum + c.openRate, 0);
      return Math.round(totalOpen / campaigns.length);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Click Rate',
          data: clickRates,
          backgroundColor: colors.chart1,
          hoverBackgroundColor: colors.primaryLight,
          borderRadius: 12,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
        {
          label: 'Open Rate',
          data: openRates,
          backgroundColor: colors.chart2,
          hoverBackgroundColor: colors.secondaryLight,
          borderRadius: 12,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }
      ]
    };
  }, [data, timeFrame, mode]);

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

  const totalClickRate = chartData.datasets[0]?.data?.reduce((a: number, b: number) => a + b, 0) / chartData.datasets[0]?.data?.length || 0;
  const totalOpenRate = chartData.datasets[1]?.data?.reduce((a: number, b: number) => a + b, 0) / chartData.datasets[1]?.data?.length || 0;

  return (
    <EmailChartContainer mode={mode}>
      <CardContent>
        <EmailChartHeader>
          <Box>
            <EmailChartTitle mode={mode}>
              Email Engagement Metrics
            </EmailChartTitle>
            <EmailChartSubtitle mode={mode}>
              Performance across {timeFrame} campaigns
            </EmailChartSubtitle>
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
        </EmailChartHeader>

        <EmailChartCanvas>
          {chartData.labels.length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
              sx={{ color: colors.textSecondary }}
            >
              <Typography variant="body1">
                No email data available for the selected period
              </Typography>
            </Box>
          )}
        </EmailChartCanvas>

        {chartData.labels.length > 0 && (
          <MetricSummary mode={mode}>
            <MetricItem>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Avg. Click Rate
              </Typography>
              <Typography variant="h6" sx={{ color: colors.chart1 }}>
                {totalClickRate.toFixed(1)}%
              </Typography>
            </MetricItem>
            <MetricItem>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Avg. Open Rate
              </Typography>
              <Typography variant="h6" sx={{ color: colors.chart2 }}>
                {totalOpenRate.toFixed(1)}%
              </Typography>
            </MetricItem>
            <MetricItem>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Total Campaigns
              </Typography>
              <Typography variant="h6" sx={{ color: colors.textPrimary }}>
                {data?.length || 0}
              </Typography>
            </MetricItem>
          </MetricSummary>
        )}
      </CardContent>
    </EmailChartContainer>
  );
};

export default EmailSent;