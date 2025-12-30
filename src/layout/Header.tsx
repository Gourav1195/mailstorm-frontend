import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ArrowDropDown';
import { useSelector } from 'react-redux';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { RootState } from 'redux/store'; // Import your RootState
import { useAppDispatch } from '../../src/redux/hooks';
import { toggleTheme } from 'redux/slices/themeSlice';

const Header = (props: any) => {
  const { drawerWidth = 240 } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications] = useState(0); // Default notification count
  const [name] = useState('Michael Scott');
  const [email] = useState('michael.s@email.com');

  // ✅ Get theme mode from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useAppDispatch();

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ Only dispatch on button click
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          background: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left part: Welcome text */}
          <Box>
            <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.secondary' }}>
              Welcome, {name}!
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "16px", color: 'text.primary' }}>
              Ready to Boost Your Campaign
            </Typography>
          </Box>

          {/* Right part: Theme toggle, Notifications, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* Notifications Icon */}
            <IconButton color="inherit" aria-label="notifications">
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon sx={{ color: 'text.primary' }} />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              sx={{
                color: 'text.primary',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Avatar sx={{ width: 35, height: 35 }} src="https://www.w3schools.com/w3images/avatar2.png" />
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.primary' }}>
                  {name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.secondary' }}>
                  {email}
                </Typography>
              </Box>
              <IconButton
                onClick={handleProfileMenuOpen}
                aria-controls="profile-menu"
                aria-haspopup="true"
                sx={{ ml: 0.5 }}
              >
                <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Box>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>My Account</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Log Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;