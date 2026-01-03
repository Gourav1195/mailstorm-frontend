import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { loadCampaigns, pauseResumeCampaign, duplicateCampaign, deleteCampaign } from "../redux/slices/campaignSlice";
import { RootState } from "../redux/store";
import {
  Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, MenuItem, IconButton, TableContainer, Paper,
  Box, useMediaQuery, FormControl, InputLabel, Select, InputBase, Container, Alert, Snackbar,
  SelectChangeEvent, Chip, Avatar, Badge, Tooltip, Card, alpha,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteConfirmationModal from "./Modals/AllModal";
import { Dayjs } from 'dayjs';
import CryptoJS from "crypto-js";
import EmptyCampaign from "./CampaignWizard/EmptyCampaign";
import { updateCampaignList } from '../redux/slices/campaignSlice';
import { getFakeId } from "../utils/getFakeId";
import { setSelectedCampaignData } from '../redux/slices/campaignSlice';
import { useDesignSystem } from "../design/theme";

interface CampaignProp {}

const Campaigns: React.FC<CampaignProp> = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const designSystem = useDesignSystem(mode);
  
  const [isEmptyCampaign, setIsEmptyCampaign] = useState(false);
  const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
  const { campaigns, loading, error, pagination } = useSelector((state: RootState) => state.campaign);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showAlert, setshowAlert] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    status: string;
    type: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    sortBy: string;
    page: number;
    limit: number;
    order: "asc" | "desc";
  }>({
    search: "",
    status: "",
    type: "",
    startDate: null,
    endDate: null,
    sortBy: "",
    page: 1,
    limit: 10,
    order: "desc",
  });
  const dispatch = useAppDispatch();

  const navigation = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(loadCampaigns(filters));
    }, 300);

    return () => clearTimeout(handler);
  }, [filters.search, filters.status, filters.type, filters.startDate, filters.endDate, filters.sortBy, filters.limit, filters.order, filters.page, dispatch]);

  useEffect(() => {
    dispatch(loadCampaigns({ page: filters.page, limit: filters.limit }));
  }, [filters.page, filters.limit, dispatch]);

  const handleChange = (e: any) => {
    setIsEmptyCampaign(true);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
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

  const nextPage = () => {
    if (filters.page < pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const computedSortValue = useMemo(() => {
    if (filters.sortBy === 'name') {
      return filters.order === 'asc' ? 'name_asc' : 'name_desc';
    } else {
      return filters.order === 'desc' ? 'newest' : 'oldest';
    }
  }, [filters.sortBy, filters.order]);

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    const selectedSort = e.target.value;

    if (selectedSort === "name_asc") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "name",
        order: "asc",
        page: 1,
      }));
    } else if (selectedSort === "name_desc") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "name",
        order: "desc",
        page: 1,
      }));
    } else if (selectedSort === "oldest") {
      setFilters((prev) => ({
        ...prev,
        sortBy: "createdAt",
        order: "asc",
        page: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        sortBy: "createdAt",
        order: "desc",
        page: 1,
      }));
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handlePauseResume = async (campaignId: string, campaignStatus: string) => {
    try {
      if (campaignStatus === 'Paused' || campaignStatus === 'On Going') {
        await dispatch(pauseResumeCampaign(campaignId)).unwrap();
      }
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleEditClick = (id: string) => {
    const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY as string;
    const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
    navigation(`/create-campaign/${encodeURIComponent(encryptedId)}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalopen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      dispatch(deleteCampaign(selectedId));
      setAlertError('Campaign deleted successfully');
      setshowAlert(true);      
    }
    setIsDeleteModalopen(false);
  };

  const handleDuplicate = async (campaignId: string) => {
    try {      
      const action = await dispatch(duplicateCampaign(campaignId));

      if (duplicateCampaign.fulfilled.match(action)) {
        const newCampaign = action.payload;
        if (newCampaign?._id) {
          setHighlightedId(newCampaign._id);

          const originalIndex = campaigns.findIndex(c => c._id === campaignId);
          if (originalIndex === -1) {
            dispatch(updateCampaignList([...campaigns, newCampaign]));
          } else {
            const updatedCampaigns = [...campaigns];
            updatedCampaigns.splice(originalIndex + 1, 0, newCampaign);
            dispatch(updateCampaignList(updatedCampaigns));
          }
        }
      }
      setTimeout(() => setHighlightedId(null), 8000);
      setAlertError('Campaign cloned successfully');
      setshowAlert(true); 
    } catch (error) {
      console.error("Failed to clone campaign:", error);
    }
  };

  const isSmallScreen = useMediaQuery(`(max-width: 900px)`);

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, { color: string; bg: string; icon?: string }> = {
      'Active': { color: designSystem.colors.success, bg: designSystem.colors.successBg, icon: '▶️' },
      'Paused': { color: designSystem.colors.warning, bg: designSystem.colors.warningBg, icon: '⏸️' },
      'Completed': { color: designSystem.colors.primary, bg: designSystem.colors.primaryBg, icon: '✅' },
      'Scheduled': { color: designSystem.colors.info, bg: designSystem.colors.infoBg, icon: '📅' },
      'Draft': { color: designSystem.colors.textTertiary, bg: designSystem.colors.surfaceElevated, icon: '📝' },
      'Expired': { color: designSystem.colors.error, bg: designSystem.colors.errorBg, icon: '⏰' },
      'On Going': { color: designSystem.colors.success, bg: designSystem.colors.successBg, icon: '🔄' },
      'Not Yet Started': { color: designSystem.colors.accent, bg: designSystem.colors.accentBg, icon: '⏳' },
    };
    return colorMap[status] || { color: designSystem.colors.textSecondary, bg: designSystem.colors.surfaceElevated };
  };

  const getTypeColor = (type: string) => {
    return type === 'Real Time' ? designSystem.colors.success : 
           type === 'Scheduled' ? designSystem.colors.primary : 
           designSystem.colors.accent;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (filters.search === "" && filters.status === ""  && filters.type === "" && filters.startDate === null && filters.endDate === null && campaigns.length === 0) return <EmptyCampaign />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ 
        py: 3, 
        backgroundColor: designSystem.colors.background,
        minHeight: '100vh',
        maxWidth: { xs: '100%', lg: '100%' },
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: designSystem.colors.textPrimary,
              fontWeight: 700,
              mb: 0.5,
              background: designSystem.colors.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Campaign Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: designSystem.colors.textSecondary }}>
              Manage and monitor your marketing campaigns
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigation('/create-campaign')}
            sx={{
              background: designSystem.colors.gradientPrimary,
              borderRadius: designSystem.effects.borderRadius.lg,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': {
                opacity: 0.9,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Create Campaign
          </Button>
        </Box>

        {/* Stats Summary */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ 
            p: 2, 
            flex: 1, 
            minWidth: 200,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.lg,
          }}>
            <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block', mb: 1 }}>
              Total Campaigns
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ color: designSystem.colors.textPrimary, fontWeight: 700 }}>
                {pagination?.total || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: designSystem.colors.success }}>
                +12% this month
              </Typography>
            </Box>
          </Card>
          
          <Card sx={{ 
            p: 2, 
            flex: 1, 
            minWidth: 200,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.lg,
          }}>
            <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block', mb: 1 }}>
              Active Campaigns
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ color: designSystem.colors.textPrimary, fontWeight: 700 }}>
                {campaigns.filter(c => c.status === 'Active' || c.status === 'On Going').length}
              </Typography>
              <Typography variant="caption" sx={{ color: designSystem.colors.success }}>
                {((campaigns.filter(c => c.status === 'Active' || c.status === 'On Going').length / campaigns.length) * 100).toFixed(0)}% of total
              </Typography>
            </Box>
          </Card>
          
          <Card sx={{ 
            p: 2, 
            flex: 1, 
            minWidth: 200,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.lg,
          }}>
            <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block', mb: 1 }}>
              Avg. Open Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ color: designSystem.colors.textPrimary, fontWeight: 700 }}>
                {campaigns.length > 0 
                  ? (campaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.length).toFixed(1)
                  : '0'}%
              </Typography>
              <TrendingUpIcon sx={{ color: designSystem.colors.success, fontSize: 16 }} />
            </Box>
          </Card>
        </Box>

        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={() => setshowAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setshowAlert(false)} 
            sx={{ 
              width: '100%',
              backgroundColor: designSystem.colors.successBg,
              color: designSystem.colors.success,
              border: `1px solid ${designSystem.colors.successBorder}`,
              '& .MuiAlert-icon': { color: designSystem.colors.success }
            }}
          >
            {alertError}
          </Alert>
        </Snackbar>

        {/* Filters Card */}
        <Card sx={{ 
          p: 2.5,
          mb: 3,
          backgroundColor: designSystem.colors.surface,
          borderRadius: designSystem.effects.borderRadius.lg,
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.effects.shadows.default,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterListIcon sx={{ color: designSystem.colors.primary }} />
              <Typography variant="subtitle1" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>
                Filters
              </Typography>
            </Box>
            <Badge
              badgeContent={
                (filters.search ? 1 : 0) +
                (filters.status ? 1 : 0) +
                (filters.type ? 1 : 0) +
                (filters.startDate ? 1 : 0) +
                (filters.endDate ? 1 : 0)
              }
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: designSystem.colors.primary,
                  color: designSystem.colors.textInverse,
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {/* Search */}
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <TextField
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={handleChange}
                name="search"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: designSystem.colors.textTertiary, mr: 1 }} />,
                  sx: {
                    backgroundColor: designSystem.colors.surfaceElevated,
                    borderRadius: designSystem.effects.borderRadius.md,
                    '& fieldset': {
                      borderColor: designSystem.colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: designSystem.colors.primary,
                    },
                  }
                }}
              />
            </Box>

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                name="status"
                value={filters.status}
                onChange={handleChange}
                displayEmpty
                sx={{
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.md,
                  '& .MuiSelect-select': {
                    color: designSystem.colors.textPrimary,
                  },
                  '& fieldset': {
                    borderColor: designSystem.colors.border,
                  },
                }}
              >
                <MenuItem value="" sx={{ color: designSystem.colors.textTertiary }}>
                  All Status
                </MenuItem>
                {["Scheduled", "Draft", "Active", "Completed", "On Going", "Expired", "Paused", "Not Yet Started"].map((status) => {
                  const statusColors = getStatusColor(status);
                  return (
                    <MenuItem key={status} value={status}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: statusColors.color 
                        }} />
                        {status}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {/* Type Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                name="type"
                value={filters.type}
                onChange={handleChange}
                displayEmpty
                sx={{
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.md,
                  '& .MuiSelect-select': {
                    color: designSystem.colors.textPrimary,
                  },
                  '& fieldset': {
                    borderColor: designSystem.colors.border,
                  },
                }}
              >
                <MenuItem value="" sx={{ color: designSystem.colors.textTertiary }}>
                  All Types
                </MenuItem>
                {["Criteria Based", "Real Time", "Scheduled"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Filters */}
            <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 250 }}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date: Dayjs | null) =>
                  setFilters((prev) => ({ ...prev, startDate: date }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      flex: 1,
                      '& .MuiInputBase-input': {
                        color: designSystem.colors.textPrimary,
                      },
                      '& fieldset': {
                        borderColor: designSystem.colors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: designSystem.colors.primary,
                      },
                    }
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date: Dayjs | null) =>
                  setFilters((prev) => ({ ...prev, endDate: date }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      flex: 1,
                      '& .MuiInputBase-input': {
                        color: designSystem.colors.textPrimary,
                      },
                      '& fieldset': {
                        borderColor: designSystem.colors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: designSystem.colors.primary,
                      },
                    }
                  },
                }}
              />
            </Box>

            {/* Sort Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={computedSortValue}
                onChange={handleSortChange}
                sx={{
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.md,
                  '& .MuiSelect-select': {
                    color: designSystem.colors.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                  '& fieldset': {
                    borderColor: designSystem.colors.border,
                  },
                }}
                startAdornment={<SortIcon sx={{ color: designSystem.colors.textTertiary, mr: 1 }} />}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Card>

        {/* Campaigns Table */}
        <Card sx={{ 
          backgroundColor: designSystem.colors.surface,
          borderRadius: designSystem.effects.borderRadius.lg,
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.effects.shadows.default,
          overflow: 'hidden',
        }}>
          <TableContainer ref={tableRef}>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: designSystem.colors.surfaceElevated,
                  '& th': {
                    borderBottom: `1px solid ${designSystem.colors.border}`,
                    color: designSystem.colors.textSecondary,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1.5,
                  }
                }}>
                  <TableCell sx={{ width: '25%' }}>CAMPAIGN</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>TYPE</TableCell>
                  <TableCell>METRICS</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(campaigns ?? []).length > 0 ? (
                  (campaigns ?? []).map((campaign) => {
                    const statusColors = getStatusColor(campaign.status || 'Draft');
                    const typeColor = getTypeColor(campaign.type || '');
                    
                    return (
                      <TableRow
                        key={campaign._id}
                        sx={{
                          borderBottom: `1px solid ${designSystem.colors.border}`,
                          backgroundColor: campaign._id === highlightedId 
                            ? alpha(designSystem.colors.primary, 0.05)
                            : 'transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: designSystem.colors.hoverSecondary,
                          },
                          '& td': {
                            py: 1.5,
                            borderBottom: `1px solid ${designSystem.colors.border}`,
                          }
                        }}
                      >
                        {/* Campaign Name & Details */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: designSystem.colors.primaryBg,
                                color: designSystem.colors.primary,
                                fontWeight: 600,
                                fontSize: '0.875rem',
                              }}
                            >
                              {campaign.name?.charAt(0).toUpperCase() || 'C'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ 
                                  color: designSystem.colors.textPrimary,
                                  fontWeight: 600,
                                  '&:hover': {
                                    color: designSystem.colors.primary,
                                    cursor: 'pointer',
                                  }
                                }}>
                                  {campaign.name}
                                </Typography>
                                <Chip
                                  label={getFakeId(campaign._id??"")}
                                  size="small"
                                  sx={{
                                    backgroundColor: designSystem.colors.surfaceElevated,
                                    color: designSystem.colors.textSecondary,
                                    fontSize: '0.7rem',
                                    height: 18,
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" sx={{ 
                                color: designSystem.colors.textTertiary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}>
                                <CalendarTodayIcon sx={{ fontSize: 12 }} />
                                Created {formatDate(
                                  typeof campaign.createdAt === 'string'
                                    ? campaign.createdAt
                                    : campaign.createdAt instanceof Date
                                      ? campaign.createdAt.toISOString()
                                      : undefined
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            label={campaign.status || 'Draft'}
                            size="small"
                            sx={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                              fontWeight: 600,
                              borderRadius: designSystem.effects.borderRadius.sm,
                              border: `1px solid ${statusColors.color}30`,
                            }}
                          />
                        </TableCell>

                        {/* Type */}
                        <TableCell>
                          <Chip
                            label={campaign.type || 'N/A'}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: typeColor,
                              color: typeColor,
                              fontWeight: 500,
                              backgroundColor: `${typeColor}15`,
                            }}
                          />
                        </TableCell>

                        {/* Metrics */}
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block' }}>
                                Open Rate
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: (campaign.openRate || 0) > 20 ? designSystem.colors.success : designSystem.colors.error,
                                fontWeight: 600,
                              }}>
                                {campaign.openRate || 0}%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block' }}>
                                CTR
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: designSystem.colors.textPrimary,
                                fontWeight: 600,
                              }}>
                                {campaign.ctr || 0}%
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: designSystem.colors.textTertiary, display: 'block' }}>
                                Delivered
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: designSystem.colors.textPrimary,
                                fontWeight: 600,
                              }}>
                                {campaign.delivered || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => campaign._id && handleEditClick(campaign._id)}
                                sx={{
                                  color: designSystem.colors.textTertiary,
                                  '&:hover': {
                                    color: designSystem.colors.primary,
                                    backgroundColor: designSystem.colors.primaryBg,
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={campaign.status === "Paused" ? "Resume" : "Pause"}>
                              <IconButton
                                size="small"
                                onClick={() => campaign._id && handlePauseResume(campaign._id, campaign.status ?? '')}
                                sx={{
                                  color: designSystem.colors.textTertiary,
                                  '&:hover': {
                                    color: campaign.status === "Paused" ? designSystem.colors.success : designSystem.colors.warning,
                                    backgroundColor: campaign.status === "Paused" ? designSystem.colors.successBg : designSystem.colors.warningBg,
                                  }
                                }}
                              >
                                {campaign.status === "Paused" ? 
                                  <PlayArrowIcon fontSize="small" /> : 
                                  <PauseIcon fontSize="small" />
                                }
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Duplicate">
                              <IconButton
                                size="small"
                                onClick={() => campaign._id && handleDuplicate(campaign._id)}
                                sx={{
                                  color: designSystem.colors.textTertiary,
                                  '&:hover': {
                                    color: designSystem.colors.accent,
                                    backgroundColor: designSystem.colors.accentBg,
                                  }
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => campaign._id && handleDeleteClick(campaign._id)}
                                sx={{
                                  color: designSystem.colors.textTertiary,
                                  '&:hover': {
                                    color: designSystem.colors.error,
                                    backgroundColor: designSystem.colors.errorBg,
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" sx={{ color: designSystem.colors.textTertiary }}>
                        Loading campaigns...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: designSystem.colors.textSecondary, mb: 1 }}>
                          No campaigns found
                        </Typography>
                        <Typography variant="body2" sx={{ color: designSystem.colors.textTertiary }}>
                          Try adjusting your filters or create a new campaign
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderTop: `1px solid ${designSystem.colors.border}`,
            backgroundColor: designSystem.colors.surfaceElevated,
          }}>
            <Button
              onClick={prevPage}
              disabled={filters.page <= 1}
              sx={{
                color: designSystem.colors.textSecondary,
                '&:hover': {
                  color: designSystem.colors.primary,
                },
                '&.Mui-disabled': {
                  color: designSystem.colors.textDisabled,
                }
              }}
            >
              Previous
            </Button>
            
            <Typography variant="body2" sx={{ color: designSystem.colors.textSecondary }}>
              Page <Box component="span" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>{pagination.page || 1}</Box> of <Box component="span" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>{pagination.totalPages || 1}</Box>
            </Typography>
            
            <Button
              onClick={nextPage}
              disabled={filters.page >= (pagination.totalPages || 1)}
              sx={{
                color: designSystem.colors.textSecondary,
                '&:hover': {
                  color: designSystem.colors.primary,
                },
                '&.Mui-disabled': {
                  color: designSystem.colors.textDisabled,
                }
              }}
            >
              Next
            </Button>
          </Box>
        </Card>

        <DeleteConfirmationModal
          open={isDeleteModalopen}
          handleClose={() => setIsDeleteModalopen(false)}
          handleConfirm={handleConfirmDelete}
          title="Delete Campaign"
          message="Are you sure you want to delete this campaign? This action cannot be undone."
          mode={mode}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default Campaigns;