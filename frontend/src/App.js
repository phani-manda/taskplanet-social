import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SocialFeed from './pages/SocialFeed';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f2f5',
        pb: 8 
      }}>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={user ? <SocialFeed /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <Signup /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {user && <BottomNav />}
      </Box>
    </Router>
  );
}

export default App;
