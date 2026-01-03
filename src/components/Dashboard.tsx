import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  styled,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Select, MenuItem, FormControl,
  useTheme, useMediaQuery,
  alpha,
  IconButton,
} from '@mui/material';
import { Types } from 'mongoose';
import CampaignPerformanceChart from './Charts/CampaignPerformanceChart';
import EmailSent from './Charts/EmailSent';
import { setSelectedCampaignData } from '../redux/slices/campaignSlice';
import { RootState } from '../../src/redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../src/redux/hooks';
import { fetchDashboardData } from '../../src/redux/slices/dashboardSlice';
import { TotalAudience, ScheduledCampaigns, ActiveCampaigns } from 'types/dashboard';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeToggleButton } from '../design/theme';
// import { useThemeMode } from '../hooks/useThemeMode';
import { useDesignSystem } from '../design/theme';
import { DashboardContainer, SectionHeader, MetricCard, MetricHeader, MetricLabel, MetricValue, MetricTrend, TimeSelect, IconContainer, PrimaryButton, SecondaryButton, ActivityList, ActivityItem, ActivityIcon, ActivityTitle, ActivitySubtitle, ActivityTime } from '../design/components';

interface DashboardProps {}

type AudienceKey = keyof TotalAudience;
type ScheduledKey = keyof ScheduledCampaigns;
type ActiveKey = keyof ActiveCampaigns;

const Dashboard: React.FC<DashboardProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeDropdownOption, setActiveDropdownOption] = useState<ActiveKey>("weekly");
  const [scheduleDropdownOption, setScheduleDropdownOption] = useState<ActiveKey>("weekly");
  const [audienceDropdownOption, setaudienceDropdownOption] = useState<AudienceKey>("monthly");
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const ds = useDesignSystem(mode);

  function timeAgo(date: number) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    const units = [
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];
    for (const unit of units) {
      const value = Math.floor(seconds / unit.seconds);
      if (value >= 1) {
        return `${value} ${unit.label}${value !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  useEffect(() => {  
    dispatch(setSelectedCampaignData({
      _id:'',
      name: '',
      type: '',
      audience: null,
      template: null,
      schedule: null,
      status: 'Draft',
      openRate: 0,
      ctr: 0,
      delivered: 0,
    }));      
  }, []);

  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchDashboardData());
      if (fetchDashboardData.fulfilled.match(result)) {
        console.log("🎯 Data from payload:", result.payload);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) return (
    <DashboardContainer mode={mode} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: ds.colors.textSecondary }}>Loading dashboard...</Typography>
    </DashboardContainer>
  );
  
  if (error) return (
    <DashboardContainer mode={mode} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#DC2626' }}>Error: {error}</Typography>
    </DashboardContainer>
  );

  return (
    <DashboardContainer mode={mode} sx={{ padding: isMobile ? ds.spacing.md : ds.spacing.lg }}>
      {/* Header Section with Theme Toggle */}
      <SectionHeader mode={mode}>
        <Box>
          <Typography 
            sx={{ 
              fontSize: ds.typography.scale.h1.fontSize,
              fontWeight: ds.typography.scale.h1.fontWeight,
              color: ds.colors.textPrimary,
              letterSpacing: '-0.02em',
              mb: 1,
              lineHeight: ds.typography.scale.h1.lineHeight,
            }}
          >
            Dashboard
          </Typography>
          <Typography 
            sx={{ 
              color: ds.colors.textSecondary,
              fontSize: ds.typography.scale.body2.fontSize,
              lineHeight: ds.typography.scale.body2.lineHeight,
            }}
          >
            Overview of your marketing performance
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            sx={{ gap: { xs: 1, sm: 2 } }}
          >
            <SecondaryButton mode={mode} onClick={() => navigation('/templates')}>
              Manage Templates
            </SecondaryButton>
            <SecondaryButton mode={mode}>
              View Reports
            </SecondaryButton>
            <PrimaryButton mode={mode} onClick={() => navigation('/create-campaign')}>
              + Create Campaign
            </PrimaryButton>
          </Box>
        </Box>
      </SectionHeader>

      {/* Metrics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard mode={mode}>
            <CardContent>
              <MetricHeader>
                <IconContainer mode={mode} color="primary">
                  <Box component="img" 
                    src={`${process.env.PUBLIC_URL}/icons/active_campaigns.png`} 
                    alt="Active Campaigns Icon"
                    sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
                  />
                </IconContainer>
                <FormControl size="small">
                  <TimeSelect
                    mode={mode}
                    value={activeDropdownOption}
                    onChange={(e) => setActiveDropdownOption(e.target.value as ActiveKey)}
                  >
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="monthly">Monthly</MenuItem>
                  </TimeSelect>
                </FormControl>
              </MetricHeader>
              <MetricLabel mode={mode}>Active Campaigns</MetricLabel>
              <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
                <MetricValue mode={mode}>{data?.activeCampaigns?.daily?.count}</MetricValue>
                <MetricTrend mode={mode}>12%</MetricTrend>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard mode={mode}>
            <CardContent>
              <MetricHeader>
                <IconContainer mode={mode} color="secondary">
                  <Box component="img" 
                    src={`${process.env.PUBLIC_URL}/icons/schedule_campaigns.png`} 
                    alt="Scheduled Campaigns Icon"
                    sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
                  />
                </IconContainer>
                <FormControl size="small">
                  <TimeSelect
                    mode={mode}
                    value={scheduleDropdownOption}
                    onChange={(e) => setScheduleDropdownOption(e.target.value as ScheduledKey)}
                  >
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="monthly">Monthly</MenuItem>
                  </TimeSelect>
                </FormControl>
              </MetricHeader>
              <MetricLabel mode={mode}>Scheduled Campaigns</MetricLabel>
              <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
                <MetricValue mode={mode}>{data?.scheduledCampaigns?.[scheduleDropdownOption]?.count}</MetricValue>
                <MetricTrend mode={mode}>8%</MetricTrend>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard mode={mode}>
            <CardContent>
              <MetricHeader>
                <IconContainer mode={mode} color="accent">
                  <Box component="img" 
                    src={`${process.env.PUBLIC_URL}/icons/total_audience.png`} 
                    alt="Total Audience Icon"
                    sx={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }}
                  />
                </IconContainer>
                <FormControl size="small">
                  <TimeSelect
                    mode={mode}
                    value={audienceDropdownOption}
                    onChange={(e) => setaudienceDropdownOption(e.target.value as AudienceKey)}
                  >
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="daily">Daily</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="weekly">Weekly</MenuItem>
                    <MenuItem sx={{ fontSize: ds.typography.scale.caption.fontSize }} value="monthly">Monthly</MenuItem>
                  </TimeSelect>
                </FormControl>
              </MetricHeader>
              <MetricLabel mode={mode}>Total Audience</MetricLabel>
              <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
                <MetricValue mode={mode}>{data?.totalAudience?.[audienceDropdownOption]?.count ?? 'NA'}</MetricValue>
                <MetricTrend mode={mode}>12%</MetricTrend>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Charts Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <EmailSent data={data?.emailsSent?.monthlyStats} />            
            </Grid>
            <Grid size={{ xs: 12 }}>
                <CampaignPerformanceChart stats={data?.emailsSent?.monthlyStats} />
           </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography 
              sx={{ 
                fontSize: ds.typography.scale.h4.fontSize,
                fontWeight: ds.typography.scale.h4.fontWeight,
                color: ds.colors.textPrimary,
                mb: 2,
                pl: 2,
                lineHeight: ds.typography.scale.h4.lineHeight,
              }}
            >
              Recent Activity
            </Typography>
            <ActivityList mode={mode}>
              {data?.recentActivity.map((activity) => (
                <ActivityItem key={activity._id.toString()}>
                  <ActivityIcon mode={mode}>
                    <Box component="span" sx={{ fontSize: '16px' }}>↗</Box>
                  </ActivityIcon>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ActivityTitle mode={mode}>
                      {activity.name}
                    </ActivityTitle>
                    <ActivitySubtitle mode={mode}>
                      Michael Scott created {activity.name}
                    </ActivitySubtitle>
                  </Box>
                  <ActivityTime mode={mode}>
                    {timeAgo(activity.createdAt)}
                  </ActivityTime>
                </ActivityItem>
              ))}
            </ActivityList>
          </Box>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;