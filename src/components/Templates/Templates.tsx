import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  MenuItem,
  Select,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack, Modal,
  TextareaAutosize,
  FormControl,
  InputLabel,
  InputBase,
  Card,
  Container,
  Menu,
  Button,
  Tooltip,
  Divider,
  Grid2 as Grid,
  Alert,
  Snackbar,
  Avatar,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChecklistIcon from '@mui/icons-material/Checklist';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCampaignData } from '../../redux/slices/campaignSlice';
import {
  getTemplates, getRecentlyUsedTemplates, toggleFavorite,
  getFavoriteTemplates, setFilters, setActiveTab, getTemplateById,
  clearSelectedTemplate,
  updateTemplate,
  deleteTemplate,
  restoreTemplate,
  duplicateTemplate,
  setAllTemplates,
  setRecentTemplates,
  setFavoriteTemplates,
} from "../../redux/slices/templateSlice";
import { RootState } from "../../redux/store";
import { useDebounce } from "use-debounce";
import DeleteModal from "../Modals/AllModal";
import type { Template } from "../../redux/slices/templateSlice";
import CustomPreview from "./CustomPreview";
import { useNavigate } from "react-router-dom";
import SMSPreview from '../Modals/SMSPreview'
import EmptyTemplates from "./EmptyTemplates";
import CryptoJS from "crypto-js";
import { useDesignSystem } from "../../design/theme";

const TemplatesTable: React.FC = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const designSystem = useDesignSystem(mode);
  
  const dispatch = useDispatch();

  const {
    allTemplates = [],
    recentTemplates = [],
    favoriteTemplates = [],
    filters = { page: 1, limit: 10, type: "", category: "", sortBy: "" },
    totalPages = 1,
    activeTab = "all",
    selectedTemplate = null,
  } = useSelector((state: RootState) => state.template || {});

  const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [openSMSModal, setOpenSMSModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [totalLocalFavorites, setTotalLocalFavorites] = useState(1);
  const [selectedId, setSelectedId] = useState<string | number>(1);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Record<string, HTMLElement | null>>({});
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigation = useNavigate();

  // Enhanced color mappings for categories
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, { color: string; bg: string; icon?: string }> = {
      'Promotional': { color: designSystem.colors.success, bg: designSystem.colors.successBg, icon: '🎯' },
      'Transactional': { color: designSystem.colors.warning, bg: designSystem.colors.warningBg, icon: '💳' },
      'Event Based': { color: designSystem.colors.primary, bg: designSystem.colors.primaryBg, icon: '🎉' },
      'Update': { color: designSystem.colors.info, bg: designSystem.colors.infoBg, icon: '🔄' },
      'Announcement': { color: designSystem.colors.accent, bg: designSystem.colors.accentBg, icon: '📢' },
      'Action': { color: designSystem.colors.secondary, bg: designSystem.colors.secondaryBg, icon: '⚡' },
      'Product': { color: designSystem.colors.chart5, bg: `${designSystem.colors.chart5}15`, icon: '📦' },
      'Holiday': { color: designSystem.colors.chart4, bg: `${designSystem.colors.chart4}15`, icon: '🎄' },
    };
    return colorMap[category] || { color: designSystem.colors.textSecondary, bg: designSystem.colors.surfaceElevated, icon: '📄' };
  };

  // Get template type color
  const getTypeColor = (type: string) => {
    return type === 'Email' ? designSystem.colors.primary : designSystem.colors.secondary;
  };

  useEffect(() => {
    dispatch(setFilters({ page: 1 }));
  }, [debouncedSearch, filters.type, filters.category, filters.sortBy, dispatch]);

  useEffect(() => {
    if (selectedTemplate) {
      setEditName(selectedTemplate.name);
      setEditContent(JSON.stringify(selectedTemplate.content, null, 2));
    }
  }, [selectedTemplate]);

  const handleAnchorClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl((prev) => ({
      ...prev,
      [id]: event.currentTarget,
    }));
  };

  const handleAnchorClose = (id: string) => {
    setMenuAnchorEl(({}));
  };

  useEffect(() => {
    dispatch(setSelectedCampaignData({
      _id: '',
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

  const buildQuery = () => {
    const query: any = { page: filters.page, limit: filters.limit };
    if (debouncedSearch?.trim()) query.search = debouncedSearch.trim();
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    switch (filters.sortBy || "newest") {
      case "newest": query.sortBy = "createdAt"; query.order = "desc"; break;
      case "oldest": query.sortBy = "createdAt"; query.order = "asc"; break;
      case "nameAsc": query.sortBy = "name"; query.order = "asc"; break;
      case "nameDesc": query.sortBy = "name"; query.order = "desc"; break;
    }
    return query;
  };

  const refreshActiveTab = () => {
    const query = buildQuery();
    if (activeTab === "all") dispatch(getTemplates(query) as any);
    else if (activeTab === "recent") dispatch(getRecentlyUsedTemplates(query) as any);
    else if (activeTab === "favorite") dispatch(getFavoriteTemplates(query) as any);
  };

  useEffect(() => {
    refreshActiveTab();
  }, [dispatch, activeTab, filters.page, filters.limit, debouncedSearch, filters.type, filters.category, filters.sortBy]);

  useEffect(() => {
    if (activeTab === "favorite") {
      setTotalLocalFavorites(totalPages || 1);
    }
  }, [favoriteTemplates, activeTab, totalPages]);

  const handleTabChange = (event: React.SyntheticEvent, tab: "all" | "recent" | "favorite") => {
    dispatch(setActiveTab(tab));
    dispatch(setFilters({ page: 1 }));
    setSearchTerm("");
  };

  const handleFavoriteToggle = async (templateId: string) => {
    await dispatch(toggleFavorite(templateId) as any);
    refreshActiveTab();
  };

  const handleViewTemplate = (templateId: string, type: string) => {
    dispatch(getTemplateById(templateId) as any);
    if (type === 'Email') {
      setOpenIndex(templateId);
    } else if (type === 'SMS') {
      setOpenSMSModal(true);
      setOpenIndex(templateId);
    }
  };

  const handleClose = () => {
    setOpenIndex(null);
  };

  const handleFilterChange = (e: any) => {
    dispatch(setFilters({ [e.target.name]: e.target.value, page: 1 }));
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? filters.page + 1 : Math.max(filters.page - 1, 1);
    dispatch(setFilters({ page: newPage }));
  };

  const handleEditClick = async (id: string, type: string) => {
    await dispatch(getTemplateById(id) as any);
    const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY as string;
    const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();

    if (type === "Email") {
      navigation(`/build-template/${encodeURIComponent(encryptedId)}`);
    } else {
      navigation(`/build-sms/${encodeURIComponent(encryptedId)}`);
    }
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditName("");
    setEditContent("");
    dispatch(clearSelectedTemplate());
    refreshActiveTab();
  };

  const handleSaveEdit = async () => {
    if (selectedTemplate) {
      const updatedData = {
        ...selectedTemplate,
        name: editName,
        content: JSON.parse(editContent),
      };
      await dispatch(updateTemplate({ id: selectedTemplate._id, data: updatedData }) as any);
      setOpenEditModal(false);
      dispatch(clearSelectedTemplate());
      refreshActiveTab();
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    setSelectedId(id);
    setIsDeleteModalopen(true);
    setMenuAnchorEl(({}));
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await dispatch(deleteTemplate(String(selectedId)) as any);
      setIsDeleteModalopen(false);
      refreshActiveTab();
      setSuccessMessage("Template deleted successfully");
    }
  };

  const handleRestoreTemplate = async (id: string) => {
    await dispatch(restoreTemplate(id) as any);
    refreshActiveTab();
  };

  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleDuplicateTemplate = async (id: string) => {
    const res: any = await dispatch(duplicateTemplate(id) as any);
    if (!duplicateTemplate.fulfilled.match(res)) return;

    const duplicated: Template = res.payload.template;
    let newList: Template[];

    if (activeTab === "all") {
      const idx = allTemplates.findIndex((t) => t._id === id);
      newList = [...allTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setAllTemplates(newList));
    } else if (activeTab === "recent") {
      const idx = recentTemplates.findIndex((t) => t._id === id);
      newList = [...recentTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setRecentTemplates(newList));
    } else {
      const idx = favoriteTemplates.findIndex((t) => t._id === id);
      newList = [...favoriteTemplates];
      newList.splice(idx + 1, 0, duplicated);
      dispatch(setFavoriteTemplates(newList));
    }

    setHighlightedId(duplicated._id);
    setMenuAnchorEl(({}));
    setTimeout(() => setHighlightedId(null), 8000);
    setSuccessMessage("Template duplicated successfully");
  };

  const templatesToShow =
    activeTab === "all" ? allTemplates :
      activeTab === "recent" ? recentTemplates :
        favoriteTemplates;

  const isLoading = () =>
    (activeTab === "all" && allTemplates.length === 0) ||
    (activeTab === "recent" && recentTemplates.length === 0) ||
    (activeTab === "favorite" && favoriteTemplates.length === 0);

  if (filters.search === "" && filters.category === '' && filters.sortBy === '' && allTemplates.length === 0) return <EmptyTemplates />;

  return (
    <Container sx={{ 
      py: 4, 
      bgcolor: designSystem.colors.background,
      maxWidth: { xs: '100%', lg: '100%' },
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ 
          color: designSystem.colors.textPrimary,
          fontWeight: 600,
          background: designSystem.colors.gradientPrimary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Template Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: designSystem.colors.gradientPrimary,
            '&:hover': {
              opacity: 0.9,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
          onClick={() => navigation('/build-template')}
        >
          Create Template
        </Button>
      </Box>

      <Snackbar
        open={successMessage ? true : false}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccessMessage(null)} 
          sx={{ 
            width: '100%',
            backgroundColor: designSystem.colors.successBg,
            color: designSystem.colors.success,
            border: `1px solid ${designSystem.colors.successBorder}`,
            '& .MuiAlert-icon': { color: designSystem.colors.success }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Card sx={{ 
        p: 3, 
        backgroundColor: designSystem.colors.surface,
        borderRadius: designSystem.effects.borderRadius.lg,
        boxShadow: designSystem.effects.shadows.default,
        border: `1px solid ${designSystem.colors.border}`,
      }}>
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                color: designSystem.colors.textTertiary,
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
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>All Templates</span>
                  <Badge
                    badgeContent={allTemplates.length}
                    color="primary"
                    sx={{
                      ml:1,
                      '& .MuiBadge-badge': {
                        backgroundColor: designSystem.colors.primary,
                        color: designSystem.colors.textInverse,
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  />
                </Box>
              } 
              value={"all"} 
            />
            <Tab 
              label="Recently Used" 
              value={"recent"} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ fontSize: 16 }} />
                  <span>Favorites</span>
                </Box>
              } 
              value={"favorite"} 
            />
          </Tabs>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" mb={3} sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl variant="outlined" size="small">
              <TextField
                placeholder="Search templates or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: designSystem.colors.textTertiary, mr: 1 }} />
                  ),
                  sx: {
                    backgroundColor: designSystem.colors.surfaceElevated,
                    borderRadius: designSystem.effects.borderRadius.sm,
                    width: 280,
                    '& fieldset': {
                      borderColor: designSystem.colors.border,
                    },
                    '&:hover fieldset': {
                      borderColor: designSystem.colors.primary,
                    },
                  }
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              bgcolor: designSystem.colors.surfaceElevated, 
              borderRadius: designSystem.effects.borderRadius.sm,
              p: 0.5,
              border: `1px solid ${designSystem.colors.border}`,
            }}>
              <Tooltip title="List View">
                <IconButton
                  onClick={() => setView('list')}
                  sx={{
                    color: view === 'list' ? designSystem.colors.primary : designSystem.colors.textTertiary,
                    backgroundColor: view === 'list' ? designSystem.colors.primaryBg : 'transparent',
                    borderRadius: designSystem.effects.borderRadius.xs,
                  }}
                >
                  <ChecklistIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setView('grid')}
                  sx={{
                    color: view === 'grid' ? designSystem.colors.primary : designSystem.colors.textTertiary,
                    backgroundColor: view === 'grid' ? designSystem.colors.primaryBg : 'transparent',
                    borderRadius: designSystem.effects.borderRadius.xs,
                  }}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <Select
                id="category-select"
                name="category"
                value={filters.category || ""}
                onChange={handleFilterChange}
                displayEmpty
                sx={{
                  fontSize: '0.875rem',
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.sm,
                  '& .MuiSelect-select': {
                    color: designSystem.colors.textPrimary,
                  },
                  '& fieldset': {
                    borderColor: designSystem.colors.border,
                  },
                }}
                startAdornment={<FilterListIcon sx={{ color: designSystem.colors.textTertiary, mr: 1 }} />}
              >
                <MenuItem value="" sx={{ color: designSystem.colors.textTertiary }}>
                  All Categories
                </MenuItem>
                {["Promotional", "Transactional", "Event Based", "Update", "Announcement", "Action", "Product", "Holiday"].map((c) => (
                  <MenuItem key={c} value={c} sx={{ color: designSystem.colors.textPrimary }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                id="type-select"
                name="type"
                value={filters.type || ""}
                onChange={handleFilterChange}
                displayEmpty
                sx={{
                  fontSize: '0.875rem',
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.sm,
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
                <MenuItem value="Email" sx={{ color: designSystem.colors.textPrimary }}>
                  Email
                </MenuItem>
                <MenuItem value="SMS" sx={{ color: designSystem.colors.textPrimary }}>
                  SMS
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                id="sortby-select"
                name="sortBy"
                value={filters.sortBy || ""}
                onChange={handleFilterChange}
                displayEmpty
                sx={{
                  fontSize: '0.875rem',
                  backgroundColor: designSystem.colors.surfaceElevated,
                  borderRadius: designSystem.effects.borderRadius.sm,
                  '& .MuiSelect-select': {
                    color: designSystem.colors.textPrimary,
                  },
                  '& fieldset': {
                    borderColor: designSystem.colors.border,
                  },
                }}
              >
                <MenuItem value="" sx={{ color: designSystem.colors.textTertiary }}>
                  Sort by
                </MenuItem>
                <MenuItem value="newest" sx={{ color: designSystem.colors.textPrimary }}>
                  Newest
                </MenuItem>
                <MenuItem value="oldest" sx={{ color: designSystem.colors.textPrimary }}>
                  Oldest
                </MenuItem>
                <MenuItem value="nameAsc" sx={{ color: designSystem.colors.textPrimary }}>
                  Name (A to Z)
                </MenuItem>
                <MenuItem value="nameDesc" sx={{ color: designSystem.colors.textPrimary }}>
                  Name (Z to A)
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {view === 'list' ? (
          <Table sx={{ 
            border: `1px solid ${designSystem.colors.border}`,
            borderRadius: designSystem.effects.borderRadius.sm,
            overflow: 'hidden',
          }}>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: designSystem.colors.surfaceElevated,
                '& th': {
                  borderColor: designSystem.colors.border,
                  color: designSystem.colors.textSecondary,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2,
                }
              }}>
                <TableCell sx={{ width: '30%' }}>TEMPLATE</TableCell>
                <TableCell>TYPE</TableCell>
                <TableCell>LAST MODIFIED</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>TAGS</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templatesToShow.map((template: any, i) => {
                const categoryColors = getCategoryColor(template.category);
                const typeColor = getTypeColor(template.type);
                return (
                  <TableRow 
                    key={template._id} 
                    sx={{
                      bgcolor: i % 2 === 0 ? designSystem.colors.surface : designSystem.colors.surfaceElevated,
                      borderColor: designSystem.colors.border,
                      opacity: Boolean(template.isDeleted) ? 0.6 : 1,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: designSystem.colors.hoverSecondary,
                      }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <IconButton 
                          onClick={() => handleFavoriteToggle(template._id)} 
                          sx={{ 
                            color: template.favorite ? designSystem.colors.warning : designSystem.colors.textTertiary,
                            '&:hover': { color: designSystem.colors.warning }
                          }}
                        >
                          {template.favorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                        <Box>
                          <Typography 
                            color="primary" 
                            fontWeight={600}
                            sx={{ 
                              cursor: "pointer",
                              '&:hover': { color: designSystem.colors.primaryLight }
                            }}
                            onClick={() => handleViewTemplate(template._id, template.type)}
                          >
                            {template.name}
                          </Typography>
                          {template.description && (
                            <Typography variant="caption" color={designSystem.colors.textTertiary}>
                              {template.description.substring(0, 50)}...
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.type}
                        size="small"
                        sx={{
                          color: typeColor,
                          bgcolor: `${typeColor}15`,
                          fontWeight: 500,
                          borderRadius: designSystem.effects.borderRadius.sm,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color={designSystem.colors.textSecondary} variant="body2">
                        {new Date(template.lastModified)?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="caption" color={designSystem.colors.textTertiary}>
                        {new Date(template.lastModified)?.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>{categoryColors.icon}</span>
                            <span>{template.category}</span>
                          </Box>
                        }
                        size="small"
                        sx={{
                          color: categoryColors.color,
                          bgcolor: categoryColors.bg,
                          fontWeight: 500,
                          borderRadius: designSystem.effects.borderRadius.sm,
                          border: `1px solid ${categoryColors.color}20`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {template.tags?.slice(0, 2).map((tag: string, idx: number) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: designSystem.colors.textSecondary,
                              borderColor: designSystem.colors.borderLight,
                              fontSize: '0.75rem',
                            }}
                          />
                        ))}
                        {template.tags?.length > 2 && (
                          <Typography variant="caption" color={designSystem.colors.textTertiary}>
                            +{template.tags.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Tooltip title="Preview">
                          <IconButton 
                            onClick={() => handleViewTemplate(template._id, template.type)}
                            sx={{
                              color: designSystem.colors.textTertiary,
                              '&:hover': {
                                color: designSystem.colors.primary,
                                backgroundColor: designSystem.colors.primaryBg,
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <IconButton 
                          onClick={(e) => handleAnchorClick(e, template._id)}
                          sx={{
                            color: designSystem.colors.textTertiary,
                            '&:hover': {
                              color: designSystem.colors.primary,
                              backgroundColor: designSystem.colors.primaryBg,
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        
                        <Menu
                          anchorEl={menuAnchorEl[template._id]}
                          open={Boolean(menuAnchorEl[template._id])}
                          onClose={() => handleAnchorClose(template._id)}
                          PaperProps={{
                            sx: {
                              backgroundColor: designSystem.colors.surface,
                              border: `1px solid ${designSystem.colors.border}`,
                              boxShadow: designSystem.effects.shadows.md,
                              borderRadius: designSystem.effects.borderRadius.sm,
                              mt: 1,
                            }
                          }}
                        >
                          {!template.isDeleted && (
                            <>
                              <MenuItem 
                                onClick={() => handleEditClick(template._id, template.type)}
                                sx={{
                                  color: designSystem.colors.textPrimary,
                                  '&:hover': { backgroundColor: designSystem.colors.hover },
                                }}
                              >
                                <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
                                Edit
                              </MenuItem>
                              <MenuItem 
                                onClick={() => handleDuplicateTemplate(template._id)}
                                sx={{
                                  color: designSystem.colors.textPrimary,
                                  '&:hover': { backgroundColor: designSystem.colors.hover },
                                }}
                              >
                                <FileCopyIcon fontSize="small" sx={{ mr: 1.5 }} />
                                Duplicate
                              </MenuItem>
                            </>
                          )}
                          {template.isDeleted ? (
                            <MenuItem 
                              onClick={() => handleRestoreTemplate(template._id)}
                              sx={{
                                color: designSystem.colors.success,
                                '&:hover': { backgroundColor: designSystem.colors.successBg },
                              }}
                            >
                              <RestoreIcon fontSize="small" sx={{ mr: 1.5 }} />
                              Restore
                            </MenuItem>
                          ) : (
                            <MenuItem 
                              onClick={() => handleDeleteTemplate(template._id)}
                              sx={{
                                color: designSystem.colors.error,
                                '&:hover': { backgroundColor: designSystem.colors.errorBg },
                              }}
                            >
                              <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Grid container spacing={2.5}>
            {templatesToShow.map((template: any, i: number) => {
              const categoryColors = getCategoryColor(template.category);
              const typeColor = getTypeColor(template.type);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={template._id}>
                  <Card
                    sx={{
                      borderRadius: designSystem.effects.borderRadius.lg,
                      p: 2.5,
                      height: '100%',
                      backgroundColor: designSystem.colors.surface,
                      border: `1px solid ${designSystem.colors.border}`,
                      boxShadow: designSystem.effects.shadows.xs,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: designSystem.effects.shadows.md,
                        transform: 'translateY(-2px)',
                        borderColor: designSystem.colors.primary,
                      },
                      '&::before': template._id === highlightedId ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: designSystem.colors.gradientPrimary,
                      } : {},
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton 
                          onClick={() => handleFavoriteToggle(template._id)} 
                          sx={{ 
                            p: 0.5,
                            color: template.favorite ? designSystem.colors.warning : designSystem.colors.textTertiary,
                            '&:hover': { color: designSystem.colors.warning }
                          }}
                        >
                          {template.favorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: designSystem.colors.textPrimary }}>
                          {template.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={template.category}
                        size="small"
                        sx={{
                          color: categoryColors.color,
                          bgcolor: categoryColors.bg,
                          fontWeight: 500,
                          borderRadius: designSystem.effects.borderRadius.sm,
                          border: `1px solid ${categoryColors.color}20`,
                        }}
                      />
                    </Box>

                    {template.description && (
                      <Typography variant="body2" color={designSystem.colors.textSecondary} mb={2}>
                        {template.description.length > 80 ? `${template.description.substring(0, 80)}...` : template.description}
                      </Typography>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={template.type}
                          size="small"
                          sx={{
                            color: typeColor,
                            bgcolor: `${typeColor}15`,
                            fontWeight: 500,
                            borderRadius: designSystem.effects.borderRadius.sm,
                          }}
                        />
                        <Typography variant="caption" color={designSystem.colors.textTertiary}>
                          {new Date(template.lastModified)?.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" color={designSystem.colors.textTertiary} sx={{ display: 'block', mb: 0.5 }}>
                        Tags:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {template.tags?.slice(0, 3).map((tag: string, idx: number) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: designSystem.colors.textSecondary,
                              borderColor: designSystem.colors.borderLight,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: designSystem.colors.border, my: 1.5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewTemplate(template._id, template.type)}
                        sx={{
                          color: designSystem.colors.primary,
                          '&:hover': {
                            backgroundColor: designSystem.colors.primaryBg,
                          }
                        }}
                      >
                        Preview
                      </Button>
                      
                      <IconButton 
                        onClick={(e) => handleAnchorClick(e, template._id)}
                        size="small"
                        sx={{
                          color: designSystem.colors.textTertiary,
                          '&:hover': {
                            color: designSystem.colors.primary,
                            backgroundColor: designSystem.colors.primaryBg,
                          }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {templatesToShow.length > 0 && (
          <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange("prev")}
              disabled={filters.page === 1}
              sx={{
                borderColor: designSystem.colors.border,
                color: designSystem.colors.textPrimary,
                '&:hover': {
                  borderColor: designSystem.colors.primary,
                  backgroundColor: designSystem.colors.primaryBg,
                },
                '&.Mui-disabled': {
                  borderColor: designSystem.colors.borderLight,
                  color: designSystem.colors.textDisabled,
                }
              }}
            >
              Previous
            </Button>
            
            <Typography variant="body2" sx={{ color: designSystem.colors.textSecondary }}>
              Page <Box component="span" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>{filters.page}</Box> of <Box component="span" sx={{ color: designSystem.colors.textPrimary, fontWeight: 600 }}>
                {activeTab === "favorite" ? totalLocalFavorites : totalPages}
              </Box>
            </Typography>
            
            <Button
              variant="outlined"
              onClick={() => handlePageChange("next")}
              disabled={filters.page >= (activeTab === "favorite" ? totalLocalFavorites : totalPages ?? 1)}
              sx={{
                borderColor: designSystem.colors.border,
                color: designSystem.colors.textPrimary,
                '&:hover': {
                  borderColor: designSystem.colors.primary,
                  backgroundColor: designSystem.colors.primaryBg,
                },
                '&.Mui-disabled': {
                  borderColor: designSystem.colors.borderLight,
                  color: designSystem.colors.textDisabled,
                }
              }}
            >
              Next
            </Button>
          </Box>
        )}
      </Card>

      {selectedTemplate && selectedTemplate._id === openIndex && (
        <CustomPreview 
          key={selectedTemplate.id}
          doc={selectedTemplate.content}
          html={selectedTemplate.html}
          open={true}
          handleClose={handleClose}
        />
      )}
      
      {selectedTemplate && selectedTemplate._id === openIndex && (
        <SMSPreview
          open={openSMSModal}
          name={selectedTemplate.name}
          handleClose={() => setOpenSMSModal(false)}
          handleConfirm={() => setOpenSMSModal(false)}
          subject={selectedTemplate.subject}
          message={selectedTemplate.content}
          includeOptOut={selectedTemplate?.includeOptOutText}
        />
      )}

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={{ 
          p: 4, 
          backgroundColor: designSystem.colors.surface,
          m: "auto", 
          mt: 8, 
          width: 500, 
          borderRadius: designSystem.effects.borderRadius.lg,
          border: `1px solid ${designSystem.colors.border}`,
          boxShadow: designSystem.effects.shadows.xl,
        }}>
          {selectedTemplate ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: designSystem.colors.textPrimary }}>
                Edit Template
              </Typography>
              <Divider sx={{ borderColor: designSystem.colors.border, mb: 3 }} />
              <TextField
                fullWidth
                label="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  sx: { color: designSystem.colors.textTertiary }
                }}
                InputProps={{
                  sx: {
                    color: designSystem.colors.textPrimary,
                    '& fieldset': {
                      borderColor: designSystem.colors.border,
                    },
                  }
                }}
              />
              <TextareaAutosize
                minRows={10}
                style={{ 
                  width: "100%", 
                  padding: 12, 
                  fontFamily: "inherit", 
                  fontSize: 14,
                  backgroundColor: designSystem.colors.surfaceElevated,
                  color: designSystem.colors.textPrimary,
                  border: `1px solid ${designSystem.colors.border}`,
                  borderRadius: designSystem.effects.borderRadius.sm,
                }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button 
                  onClick={handleCloseEditModal}
                  sx={{ 
                    color: designSystem.colors.textSecondary,
                    '&:hover': {
                      backgroundColor: designSystem.colors.hoverSecondary,
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveEdit}
                  sx={{
                    background: designSystem.colors.gradientPrimary,
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </>
          ) : (
            <Typography sx={{ color: designSystem.colors.textPrimary }}>
              Loading template...
            </Typography>
          )}
        </Box>
      </Modal>

      <DeleteModal 
        open={isDeleteModalopen} 
        handleClose={() => setIsDeleteModalopen(false)} 
        handleConfirm={handleConfirmDelete} 
        title='Delete Template'
        message='Are you sure you want to delete this template? This action cannot be undone.'
        mode={mode}
      />
    </Container>
  );
};

export default TemplatesTable;