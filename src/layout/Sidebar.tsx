import React, { useEffect, useState } from "react";
import { 
  Link, 
  useLocation 
} from "react-router-dom";
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Collapse, 
  Box, 
  Drawer, 
  IconButton, 
  Typography,
  styled 
} from "@mui/material";
import {
  ExpandLess,
  Dashboard as DashboardIcon, 
  Campaign as CampaignIcon, 
  Create as CreateIcon, 
  ViewModule as TemplateIcon, 
  Group as AudienceIcon, 
  ChevronRight
} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuIcon from "@mui/icons-material/Menu";
import { DESIGN_SYSTEM } from "design/theme";
import { SidebarContainer, LogoContainer, LogoText, MenuList, MainMenuItem, SubMenuList, SubMenuItem, MenuIconWrapper, SubMenuText, SubMenuDot } from "design/componentTheme/SidebarTheme";

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  path?: string;
  active: boolean;
  subItems?: Array<{
    text: string;
    path: string;
    icon?: React.ReactNode;
    active: boolean;
  }>;
}

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  mode: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  drawerWidth, 
  mobileOpen, 
  handleDrawerToggle,
  mode 
}) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/", 
      active: false 
    },
    {
      text: "Campaigns",
      icon: <CampaignIcon />,
      active: false,
      subItems: [
        { 
          text: "Manage Campaign", 
          icon: <TemplateIcon />, 
          path: "/manage-campaign", 
          active: false 
        },
        { 
          text: "Create New Campaign", 
          icon: <CreateIcon />, 
          path: "/create-campaign", 
          active: false 
        },
      ],
    },
    {
      text: "Audience",
      icon: <AudienceIcon />,
      active: false,
      subItems: [
        { 
          text: "Manage Filter", 
          path: "/filters", 
          active: false 
        },
        { 
          text: "Create New Filter", 
          path: "/create-filters", 
          active: false 
        },
      ],
    },
    {
      text: "Templates",
      icon: <DescriptionIcon />,
      active: false,
      subItems: [
        { 
          text: "Manage Templates", 
          path: "/templates", 
          active: false 
        },
        { 
          text: "Create New Templates", 
          path: "/create-templates", 
          active: false 
        },
      ],
    },
  ]);

  useEffect(() => {
    const updatedMenuItems = menuItems.map(item => {
      if (item.subItems) {
        const updatedSubItems = item.subItems.map(subItem => ({
          ...subItem,
          active: location.pathname === subItem.path,
        }));
        const isAnySubItemActive = updatedSubItems.some(subItem => subItem.active);
        if (isAnySubItemActive) setOpenSubMenu(item.text);
        return {
          ...item,
          active: location.pathname === item.path || isAnySubItemActive,
          subItems: updatedSubItems,
        };
      }
      return {
        ...item,
        active: location.pathname === item.path,
      };
    });
    setMenuItems(updatedMenuItems);
  }, [location.pathname]);

  const handleClick = (menuItem: string) => {
    setOpenSubMenu(openSubMenu === menuItem ? null : menuItem);
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => (
      <div key={index}>
        {/* Main menu item */}
        {item.path ? (
          <Link to={item.path} style={{ textDecoration: 'none' }}>
            <MainMenuItem
              onClick={item.subItems ? () => handleClick(item.text) : undefined}
              active={item.active}
              mode={mode}
              sx={{
                cursor: 'pointer',
              }}
            >
              <MenuIconWrapper active={item.active} mode={mode}>
                {item.icon}
              </MenuIconWrapper>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
                  fontWeight: item.active ? 600 : 400,
                }}
              />
              {item.subItems && (
                openSubMenu === item.text ? 
                  <ExpandLess sx={{ fontSize: 20 }} /> : 
                  <ChevronRight sx={{ fontSize: 20 }} />
              )}
            </MainMenuItem>
          </Link>
        ) : (
          <MainMenuItem
            onClick={item.subItems ? () => handleClick(item.text) : undefined}
            active={item.active}
            mode={mode}
            sx={{
              cursor: 'pointer',
            }}
          >
            <MenuIconWrapper active={item.active} mode={mode}>
              {item.icon}
            </MenuIconWrapper>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
                fontWeight: item.active ? 600 : 400,
              }}
            />
            {item.subItems && (
              openSubMenu === item.text ? 
                <ExpandLess sx={{ fontSize: 20 }} /> : 
                <ChevronRight sx={{ fontSize: 20 }} />
            )}
          </MainMenuItem>
        )}

        {/* Submenu items */}
        {item.subItems && (
          <Collapse 
            in={openSubMenu === item.text} 
            timeout="auto" 
            unmountOnExit
            sx={{ ml: 2 }}
          >
            <SubMenuList>
              {item.subItems.map((subItem, subIndex) => (
                <Link 
                  to={subItem.path} 
                  key={subIndex}
                  style={{ textDecoration: 'none' }}
                >
                  <SubMenuItem
                    active={subItem.active}
                    mode={mode}
                  >
                    <SubMenuDot active={subItem.active} mode={mode} />
                    <SubMenuText 
                      primary={subItem.text}
                      primaryTypographyProps={{
                        fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
                        fontWeight: subItem.active ? 500 : 400,
                      }}
                    />
                  </SubMenuItem>
                </Link>
              ))}
            </SubMenuList>
          </Collapse>
        )}
      </div>
    ));
  };

  return (
    <SidebarContainer
      variant="permanent"
      mode={mode}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
        },
      }}
    >
      <LogoContainer>
        <Box 
          component='img' 
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
        <Box sx={{ display: { md: 'none' }, marginLeft: 'auto' }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ 
              color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
              '&:hover': {
                backgroundColor: DESIGN_SYSTEM.modes[mode].colors.hover,
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </LogoContainer>

      <Box sx={{ overflow: 'auto', px: 2 }}>
        <MenuList>
          {renderMenuItems()}
        </MenuList>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;