import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import {  Lock, Profile,  } from 'iconsax-react';

function getPathIndex(pathname: string) {
  let selectedTab = 0;
  switch (pathname) {
    case '/user/change-password':
      selectedTab = 2;
      break;
    default:
      selectedTab = 0;
  }
  return selectedTab;
}

// ==============================|| USER PROFILE - BASIC ||============================== //

const ProfileTab = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname));
  const handleListItemClick = (index: number, route: string) => {
    setSelectedIndex(index);
    navigate(route);
  };

  useEffect(() => {
    setSelectedIndex(getPathIndex(pathname));
  }, [pathname]);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.secondary.main } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0, '/user/profile')}>
        <ListItemIcon>
          <Profile size={18} />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2, '/user/change-password')}>
        <ListItemIcon>
          <Lock size={18} />
        </ListItemIcon>
        <ListItemText primary="Change Password" />
      </ListItemButton>

    </List>
  );
};

export default ProfileTab;
