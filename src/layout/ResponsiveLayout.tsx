import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  CssBaseline,
  Box,
  Hidden,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  styled,
} from "@mui/material";
import { useSelector } from 'react-redux';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { RootState } from 'redux/store';
import { useAppDispatch } from '../../src/redux/hooks';
import { toggleTheme } from '../../src/redux/slices/themeSlice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import { DESIGN_SYSTEM } from "design/theme";
import { ThemeContainer, ThemeAppBar, ThemeTextField, LogoContainer, LogoText, UserInfo, WelcomeText, ActionIconButton } from "design/componentTheme/ResponsiveLayoutTheme";

const drawerWidth: number = 240;
const ResponsiveLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifications] = useState(0);
  
  // Get theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useAppDispatch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeContainer mode={mode}>
      <CssBaseline />

      {/* Topbar */}
      <ThemeAppBar
        position="fixed"
        mode={mode}
        sx={{
          width: { sm: `100%` },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}>
          {/* Left section: Logo and Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Hidden mdUp>
              <ActionIconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                mode={mode}
              >
                <MenuIcon />
              </ActionIconButton>
            </Hidden>

            <LogoContainer>
              <Box 
                component="img" 
                src={`${process.env.PUBLIC_URL}/icons/logo.png`} 
                alt="Mailstorm" 
                sx={{ 
                  width: 'auto', 
                  height: '35px',
                  filter: mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }} 
              />
              <LogoText mode={mode}>
                Mailstorm
              </LogoText>
            </LogoContainer>
          </Box>

          {/* Center section: Welcome message (desktop only) */}
          <Hidden mdDown>
            <Box sx={{ ml: 9 }}>
              <WelcomeText mode={mode}>
                Welcome, Michael Scott!
              </WelcomeText>
              <Typography 
                sx={{ 
                  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
                  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
                  fontWeight: 500,
                }}
              >
                Ready to Boost Your Campaign
              </Typography>
            </Box>
          </Hidden>

          {/* Right section: Search, Theme Toggle, Notifications, Profile */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flex: 1,
            justifyContent: 'flex-end',
          }}>
            {/* Search Bar */}
            <Hidden smDown>
              <ThemeTextField
                mode={mode}
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search here"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: DESIGN_SYSTEM.modes[mode].colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { md: '200px', lg: '300px' },
                  flexShrink: 0,
                }}
              />
            </Hidden>

            {/* Theme Toggle Button */}
            <ActionIconButton
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              mode={mode}
              sx={{
                backgroundColor: DESIGN_SYSTEM.modes[mode].colors.hover,
                '&:hover': {
                  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.primary,
                  color: '#fff',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </ActionIconButton>

            {/* Notifications Icon */}
            <ActionIconButton color="inherit" aria-label="notifications" mode={mode}>
              <Badge 
                badgeContent={notifications} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.accent,
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </ActionIconButton>

            {/* User Profile */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: { xs: 0, sm: 1 } 
            }}>
              <Avatar 
                sx={{ 
                  width: 35, 
                  height: 35,
                  border: `2px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
                }} 
                src="https://www.w3schools.com/w3images/avatar2.png" 
              />
              
              <Hidden smDown>
                <UserInfo mode={mode}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Michael Scott
                  </Typography>
                  <Typography variant="body2">
                    michael.s@email.com
                  </Typography>
                </UserInfo>
              </Hidden>
            </Box>
          </Box>
        </Toolbar>
      </ThemeAppBar>

      {/* Desktop Sidebar */}
      <Hidden mdDown>
        <Sidebar 
          drawerWidth={drawerWidth} 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle}
          mode={mode}
        />
      </Hidden>

      {/* Mobile Sidebar */}
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surface,
              borderRight: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
            },
          }}
        >
          <Sidebar 
            drawerWidth={drawerWidth} 
            mobileOpen={mobileOpen} 
            handleDrawerToggle={handleDrawerToggle}
            mode={mode}
          />
        </Drawer>
      </Hidden>

      {/* Main Content Area */}
      {/* Uncomment when you have content */}
      {/* 
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: DESIGN_SYSTEM.modes[mode].colors.background,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // AppBar height
          minHeight: 'calc(100vh - 64px)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Toolbar /> 
        <Outlet />
      </Box>
      */}
    </ThemeContainer>
  );
};

export default ResponsiveLayout;