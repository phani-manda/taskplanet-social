import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Stars as StarsIcon,
  CurrencyRupee as RupeeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  const getAvatarColors = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const index = user?.firstName?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (!user) return null;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white', 
        color: 'black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ color: '#1a1a1a' }}
        >
          Social
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {/* Coins */}
          <Chip
            icon={<StarsIcon sx={{ color: '#FFD700 !important' }} />}
            label={user.coins || 50}
            sx={{
              backgroundColor: '#FFF8E1',
              fontWeight: 'bold',
              '& .MuiChip-label': { color: '#F9A825' }
            }}
          />

          {/* Balance */}
          <Chip
            icon={<RupeeIcon sx={{ fontSize: 16 }} />}
            label={(user.balance || 0).toFixed(2)}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />

          {/* Notifications */}
          <IconButton size="small">
            <Badge badgeContent={1} color="error">
              <NotificationsIcon sx={{ color: '#666' }} />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: getAvatarColors(),
                fontSize: 14,
                fontWeight: 'bold',
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user.firstName} {user.lastName}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                @{user.username}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
