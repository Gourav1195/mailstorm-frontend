import React, { useState, useEffect } from "react";
import {
  Typography, Box, Tabs, Tab, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Select, 
  MenuItem, InputAdornment, IconButton, Menu, SelectChangeEvent, 
  Snackbar, Alert, Divider, Modal, DialogActions, Dialog,
  useTheme, useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeleteModal from "../Modals/AllModal";
import { fetchFilters, applyFilter, duplicateFilterAsync, deleteFilterAsync, updateFilterAsync } from "../../redux/slices/filterSlice";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { setSelectedCampaignData } from '../../redux/slices/campaignSlice';
import CryptoJS from 'crypto-js';
import { useDesignSystem } from "../../design/theme";

const ManageFilters = () => {
    const mode = useSelector((state: RootState) => state.theme.mode);
  
  const designSystem = useDesignSystem(mode);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Record<string, HTMLElement | null>>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"saved" | "drafts">("saved");
  const isDraft = activeSubTab === "drafts";

  const [modalData, setModalData] = useState<{ open: boolean; handleConfirm: () => void | ((id: string) => void) | (() => void); title: string; message: string }>({
    open: false,
    handleConfirm: () => { },
    title: '',
    message: ''
  });

  const params = new URLSearchParams(window.location.search);
  const draft = params.get('isDraft');
  const isDraftBool = draft === 'true';

  useEffect(() => {
    if (isDraftBool) {
      setActiveSubTab("drafts");
    } else {
      setActiveSubTab("saved");
    }
  }, [isDraftBool]);

  const openDeleteSelectedModal = () => {
    setModalData({
      open: true,
      handleConfirm: handleDeleteSelectedFilters,
      title: 'Delete Selected Filters',
      message: 'Are you sure you want to delete these filters?'
    });
  }

  const openDeleteOneModal = (filterId: string) => {
    setModalData({
      open: true,
      handleConfirm: () => handleDeleteFilter(filterId),
      title: 'Delete This Item?',
      message: 'Are you sure you want to delete this thing?'
    });
  }

  const { filters, currentPage, totalPages, loading, error, appliedFilter } = useSelector(
    (state: RootState) => state.filter
  );

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

  const handleSelectFilter = (filterId: string) => {
    setSelectedFilters((prevSelected) =>
      prevSelected.includes(filterId)
        ? prevSelected.filter((id) => id !== filterId)
        : [...prevSelected, filterId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(filters.map((filter) => filter._id));
    }
    setSelectAll(!selectAll);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl((prev) => ({
      ...prev,
      [id]: event.currentTarget,
    }));
  };

  const handleClose = () => {
    setMenuAnchorEl({});
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: "saved" | "drafts") => {
    setActiveSubTab(newValue);
    setPage(1);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(fetchFilters({ page, search: debouncedSearch, sortBy, order, isDraft }));
  }, [dispatch, page, debouncedSearch, sortBy, order, isDraft]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    const selectedSort = e.target.value;
    if (selectedSort === "name_asc") {
      setSortBy("name");
      setOrder("asc");
    } else if (selectedSort === "name_desc") {
      setSortBy("name");
      setOrder("desc");
    }
    setPage(1);
  };

  const handleApplyFilter = async (filterId: string) => {
    await dispatch(applyFilter(filterId));
    setOpenModal(true);
  };

  const handleDuplicateFilter = async (filterId: string) => {
    const resultAction = await dispatch(duplicateFilterAsync(filterId));
    const newFilter = resultAction.payload.filter || resultAction.payload;

    if (newFilter && newFilter._id) {
      setHighlightedId(newFilter._id);
      setTimeout(() => setHighlightedId(null), 8000);
    }
    setShowAlert(true);
    setAlertData('Filter Cloned Successfully');
  };

  const handleDeleteFilter = (filterId: string) => {
    dispatch(deleteFilterAsync(filterId));
    setShowAlert(true);
    setModalData(prev => ({ ...prev, open: false }));
    setMenuAnchorEl({});
    setAlertData('Filter Deleted Successfully');
  };

  const handleEditFilter = (id: string) => {
    const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY as string;
    const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
    navigate(`/edit-filter/${encodeURIComponent(encryptedId)}`);
  };

  const handleUpdateFilter = async () => {
    if (selectedFilter) {
      await dispatch(updateFilterAsync({ filterId: selectedFilter._id, updatedData: selectedFilter }));
      setEditModalOpen(false);
    }
  };

  const handleDeleteSelectedFilters = () => {
    if (selectedFilters.length === 0) {
      alert("No filters selected!");
      return;
    }

    selectedFilters.forEach((filterId) => dispatch(deleteFilterAsync(filterId)));
    setSelectedFilters([]);
    setSelectAll(false);
    setAlertData('All Selected Filter Deleted Successfully');
    setShowAlert(true);
    setModalData(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      padding: designSystem.spacing.container,
      backgroundColor: designSystem.colors.background,
      minHeight: '100vh',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ 
          color: designSystem.colors.textPrimary,
          fontWeight: designSystem.typography.scale.h5.fontWeight,
        }}>
          Manage Filters
        </Typography>
      </Box>
      
      <Typography sx={{ 
        marginBottom: designSystem.spacing.section,
        color: designSystem.colors.textSecondary,
      }} variant="body2" gutterBottom>
        Save your current filters for quick access and reuse. Revisit and edit draft filters anytime to refine your criteria. This feature keeps your filters organized and within reach, streamlining your workflow in one convenient place.
      </Typography>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >        
        <Alert 
          severity="success" 
          onClose={() => setShowAlert(false)} 
          sx={{ 
            width: '100%',
            backgroundColor: designSystem.colors.successBg,
            color: designSystem.colors.success,
            border: `1px solid ${designSystem.colors.successBorder}`,
            '& .MuiAlert-icon': {
              color: designSystem.colors.success,
            }
          }}
        >
          {alertData}
        </Alert>        
      </Snackbar>

      <DeleteModal 
        open={modalData.open}
        handleClose={() => setModalData(prev => ({ ...prev, open: false }))}
        handleConfirm={modalData.handleConfirm}
        title={modalData.title}
        message={modalData.message}
        mode={mode}
      />

      <Box sx={{
        backgroundColor: designSystem.colors.surface,
        boxShadow: designSystem.effects.shadows.default,
        borderRadius: designSystem.effects.borderRadius.md,
        padding: designSystem.spacing.lg,
      }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
          <Tabs 
            value={activeSubTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                color: designSystem.colors.textTertiary,
                '&.Mui-selected': {
                  color: designSystem.colors.primary,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: designSystem.colors.primary,
              }
            }}
          >
            <Tab value="saved" label="Saved Filters" />
            <Tab value="drafts" label="Drafts" />
          </Tabs>
          <Button 
            variant="contained" 
            color="error" 
            size="small"
            onClick={() => openDeleteSelectedModal()}
            disabled={selectedFilters.length === 0}
            sx={{
              mr: 2,
              backgroundColor: selectedFilters.length === 0 
                ? `${designSystem.colors.error}40` 
                : designSystem.colors.error,
              '&:hover': {
                backgroundColor: designSystem.colors.error,
              }
            }}
          >
            Delete Selected
          </Button>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" 
          sx={{ 
            padding: designSystem.spacing.md,
            backgroundColor: designSystem.colors.surface,
            borderRadius: designSystem.effects.borderRadius.sm,
            mb: 3,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search Filters"
            size="small"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: designSystem.colors.textTertiary }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: designSystem.colors.surfaceElevated,
                borderRadius: designSystem.effects.borderRadius.sm,
                color: designSystem.colors.textPrimary,
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
            sx={{ width: 250 }}
          />

          <Select
            displayEmpty
            defaultValue=""
            variant="outlined"
            size="small"
            IconComponent={ExpandMoreIcon}
            value={sortBy === "name" ? `name_${order}` : sortBy}
            onChange={handleSortChange}
            sx={{ 
              width: 120,
              backgroundColor: designSystem.colors.surfaceElevated,
              '& .MuiSelect-select': {
                color: designSystem.colors.textPrimary,
              },
              '& fieldset': {
                borderColor: designSystem.colors.border,
              },
              '&:hover fieldset': {
                borderColor: designSystem.colors.primary,
              },
            }}
          >
            <MenuItem value="" sx={{ color: designSystem.colors.textTertiary, backgroundColor: designSystem.colors.surface, }}>Sort by</MenuItem>
            <MenuItem value="name_asc" sx={{ color: designSystem.colors.textPrimary, backgroundColor: designSystem.colors.surface, ":hover": { backgroundColor: designSystem.colors.surfaceElevated }}}>
              Name (A to Z)
            </MenuItem>
            <MenuItem value="name_desc" sx={{ color: designSystem.colors.textPrimary, backgroundColor: designSystem.colors.surface, ":hover": { backgroundColor: designSystem.colors.surfaceElevated } }}>
              Name (Z to A)
            </MenuItem>
          </Select>
        </Box>

        <TableContainer 
          component={Paper}
          sx={{
            backgroundColor: designSystem.colors.surface,
            borderRadius: designSystem.effects.borderRadius.sm,
            boxShadow: 'none',
            border: `1px solid ${designSystem.colors.border}`,
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: designSystem.colors.surfaceElevated }}>
              <TableRow>
                <TableCell sx={{ borderColor: designSystem.colors.border }}>
                  <Checkbox 
                    checked={selectAll} 
                    onChange={handleSelectAll}
                    sx={{
                      color: designSystem.colors.textTertiary,
                      '&.Mui-checked': {
                        color: designSystem.colors.primary,
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ 
                  borderColor: designSystem.colors.border,
                  color: designSystem.colors.textPrimary,
                  fontWeight: 600,
                }}>
                  FILTER NAME
                </TableCell>
                <TableCell sx={{ 
                  borderColor: designSystem.colors.border,
                  color: designSystem.colors.textPrimary,
                  fontWeight: 600,
                }}>
                  TAGS
                </TableCell>
                <TableCell sx={{ 
                  borderColor: designSystem.colors.border,
                  color: designSystem.colors.textPrimary,
                  fontWeight: 600,
                }}>
                  DESCRIPTION
                </TableCell>
                <TableCell sx={{ 
                  borderColor: designSystem.colors.border,
                  position: 'relative',
                  color: designSystem.colors.textPrimary,
                  fontWeight: 600,
                }}>
                  ACTIONS                  
                </TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: designSystem.colors.textTertiary }}>
                  Loading filters...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: designSystem.colors.error }}>
                  {error}
                </Typography>
              </Box>
            ) : (
              <TableBody>
                {filters.length > 0 ? (
                  filters
                    .filter((filter) => filter && filter.name)
                    .map((filter, index) => (
                      <TableRow 
                        key={filter._id} 
                        sx={{
                          backgroundColor: index % 2 === 0 
                            ? designSystem.colors.surface 
                            : designSystem.colors.surfaceElevated,
                          borderColor: designSystem.colors.border,
                          boxShadow: filter._id === highlightedId
                            ? `inset 0px 0px 0px 2px ${designSystem.colors.primary}`
                            : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: designSystem.colors.hoverSecondary,
                          }
                        }}
                      >
                        <TableCell sx={{ borderColor: designSystem.colors.border }}>
                          <Checkbox
                            checked={selectedFilters.includes(filter._id)}
                            onChange={() => handleSelectFilter(filter._id)}
                            sx={{
                              color: designSystem.colors.textTertiary,
                              '&.Mui-checked': {
                                color: designSystem.colors.primary,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ 
                          color: designSystem.colors.primary,
                          fontWeight: 600,
                          borderColor: designSystem.colors.border,
                        }}>
                          {filter.name}
                        </TableCell>
                        <TableCell sx={{ 
                          color: designSystem.colors.textPrimary,
                          borderColor: designSystem.colors.border,
                        }}>
                          {filter.tags.join(', ')}
                        </TableCell>
                        <TableCell sx={{ 
                          color: designSystem.colors.textSecondary,
                          borderColor: designSystem.colors.border,
                        }}>
                          {filter.description}
                        </TableCell>
                        <TableCell sx={{ borderColor: designSystem.colors.border }}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => handleApplyFilter(filter._id)}
                              sx={{
                                backgroundColor: designSystem.colors.success,
                                '&:hover': {
                                  backgroundColor: designSystem.colors.successDark,
                                }
                              }}
                            >
                              Apply
                            </Button>
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => handleDuplicateFilter(filter._id)}
                              sx={{
                                backgroundColor: designSystem.colors.warning,
                                '&:hover': {
                                  backgroundColor: designSystem.colors.warningDark,
                                }
                              }}
                            >
                              Duplicate
                            </Button>

                            <IconButton 
                              onClick={(e) => { handleClick(e, filter._id) }}
                              sx={{
                                color: designSystem.colors.textTertiary,
                                '&:hover': {
                                  color: designSystem.colors.primary,
                                  backgroundColor: designSystem.colors.hover,
                                }
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>

                            <Menu
                              anchorEl={menuAnchorEl[filter._id]}
                              open={Boolean(menuAnchorEl[filter._id])}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                              }}
                              PaperProps={{
                                sx: {
                                  backgroundColor: designSystem.colors.surface,
                                  border: `1px solid ${designSystem.colors.border}`,
                                  boxShadow: designSystem.effects.shadows.md,
                                }
                              }}
                            >
                              <MenuItem 
                                onClick={() => handleEditFilter(filter._id)}
                                sx={{
                                  color: designSystem.colors.textPrimary,
                                  '&:hover': {
                                    backgroundColor: designSystem.colors.hover,
                                  }
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem 
                                onClick={() => openDeleteOneModal(filter._id)}
                                sx={{
                                  color: designSystem.colors.error,
                                  '&:hover': {
                                    backgroundColor: `${designSystem.colors.error}10`,
                                  }
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ 
                      textAlign: 'center', 
                      color: designSystem.colors.textTertiary,
                      borderColor: designSystem.colors.border,
                      py: 3,
                    }}>
                      No filters found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
      
      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: designSystem.spacing.section,
        }}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ 
            marginRight: designSystem.spacing.sm,
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
        <Typography sx={{ color: designSystem.colors.textSecondary }}>
          Page <strong style={{ color: designSystem.colors.textPrimary }}>{currentPage || page}</strong> of <strong style={{ color: designSystem.colors.textPrimary }}>{totalPages || 1}</strong>
        </Typography>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          sx={{ 
            marginLeft: designSystem.spacing.sm,
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

      {/* Filter Details Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: designSystem.colors.surface,
            borderRadius: designSystem.effects.borderRadius.lg,
          }
        }}
      >
        <Box sx={{ 
          background: designSystem.colors.gradientPrimary,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          borderTopLeftRadius: designSystem.effects.borderRadius.lg,
          borderTopRightRadius: designSystem.effects.borderRadius.lg,
        }}>
          <Typography sx={{ 
            color: "white",
            fontWeight: 600,
          }}>
            Saved Filter
          </Typography>
          <IconButton 
            onClick={() => setOpenModal(false)}
            sx={{ 
              color: "white",
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: designSystem.colors.border }} />
        {appliedFilter ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "150px auto",
                gap: 2,
                p: 3,
              }}
            >
              <Typography sx={{ color: designSystem.colors.textTertiary }}>Filter Name</Typography>
              <Typography sx={{ color: designSystem.colors.textPrimary, fontWeight: 500 }}>{appliedFilter.name}</Typography>

              <Typography sx={{ color: designSystem.colors.textTertiary }}>Description</Typography>
              <Typography sx={{ color: designSystem.colors.textSecondary }}>{appliedFilter.description}</Typography>

              <Typography sx={{ color: designSystem.colors.textTertiary }}>Tags</Typography>
              <Typography sx={{ color: designSystem.colors.textPrimary }}>{appliedFilter.tags.toString().split(",").join(", ")}</Typography>

              <Typography sx={{ color: designSystem.colors.textTertiary }}>Last Used</Typography>
              <Typography sx={{ color: designSystem.colors.textPrimary }}>{appliedFilter.lastUsed}</Typography>

              <Typography sx={{ color: designSystem.colors.textTertiary }}>CTR %</Typography>
              <Typography sx={{ 
                color: appliedFilter.ctr > 0 ? designSystem.colors.success : designSystem.colors.error,
                fontWeight: 600,
              }}>
                {appliedFilter.ctr}%
              </Typography>
            </Box>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${designSystem.colors.border}` }}>
              <Button 
                variant="outlined" 
                onClick={() => setOpenModal(false)}
                sx={{ 
                  borderColor: designSystem.colors.border,
                  color: designSystem.colors.textSecondary,
                  '&:hover': {
                    borderColor: designSystem.colors.primary,
                    backgroundColor: designSystem.colors.primaryBg,
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setOpenModal(false)}
                sx={{ 
                  background: designSystem.colors.gradientPrimary,
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                Reuse for New Campaign
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: designSystem.colors.textTertiary }}>Loading filter details...</Typography>
          </Box>
        )}
      </Dialog>

      {/* Edit Filter Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: designSystem.colors.surface,
          boxShadow: designSystem.effects.shadows.xl,
          p: 4,
          borderRadius: designSystem.effects.borderRadius.lg,
          border: `1px solid ${designSystem.colors.border}`,
        }}>
          <IconButton 
            sx={{ 
              position: "absolute", 
              top: 8, 
              right: 8,
              color: designSystem.colors.textTertiary,
            }} 
            onClick={() => setEditModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: designSystem.colors.textPrimary, mb: 2 }}>
            Edit Filter
          </Typography>
          <Divider sx={{ borderColor: designSystem.colors.border, mb: 3 }} />
          <TextField
            label="Filter Name"
            fullWidth
            value={selectedFilter?.name || ""}
            onChange={(e) => setSelectedFilter({ ...selectedFilter, name: e.target.value })}
            sx={{ marginBottom: 2 }}
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
          <TextField
            label="Description"
            fullWidth
            value={selectedFilter?.description || ""}
            onChange={(e) => setSelectedFilter({ ...selectedFilter, description: e.target.value })}
            sx={{ marginBottom: 3 }}
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
          <Button 
            variant="contained" 
            onClick={handleUpdateFilter}
            sx={{
              background: designSystem.colors.gradientPrimary,
              '&:hover': {
                opacity: 0.9,
              }
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageFilters;