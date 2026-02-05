import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import {
  Home as HomeIcon,
  Assignment as TaskIcon,
  Public as SocialIcon,
  EmojiEvents as LeaderboardIcon,
} from '@mui/icons-material';

const BottomNav = () => {
  const [value, setValue] = React.useState(2); // Social is active by default

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ height: 64 }}
      >
        <BottomNavigationAction 
          icon={<HomeIcon />} 
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction 
          icon={<TaskIcon />} 
          sx={{ minWidth: 'auto' }}
        />
        
        {/* Center Social Button */}
        <BottomNavigationAction 
          icon={
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: -3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              <SocialIcon sx={{ color: '#1976d2', fontSize: 28 }} />
            </Box>
          }
          label="Social"
          sx={{ 
            minWidth: 'auto',
            '& .MuiBottomNavigationAction-label': {
              mt: 1,
              color: '#1976d2',
              fontWeight: 'bold'
            }
          }}
        />
        
        <BottomNavigationAction 
          icon={
            <Box sx={{ position: 'relative' }}>
              <LeaderboardIcon />
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -12,
                  display: 'flex',
                  gap: 0.3
                }}
              >
                <Box component="span" sx={{ fontSize: 10, color: '#1976d2' }}>2</Box>
                <Box component="span" sx={{ fontSize: 10, color: '#FFD700' }}>1</Box>
                <Box component="span" sx={{ fontSize: 10, color: '#CD7F32' }}>3</Box>
              </Box>
            </Box>
          }
          sx={{ minWidth: 'auto' }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
