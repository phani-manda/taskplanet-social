import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Typography,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import FilterTabs from '../components/FilterTabs';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SocialFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all' && filter !== 'for-you') {
        params.filter = filter;
      }
      const response = await api.get('/posts', { params });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/posts/search', {
        params: { q: searchQuery }
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const getInitials = () => {
    return `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      {/* Search Bar */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          placeholder="Search promotions, users, posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 25,
              bgcolor: 'white',
              '& fieldset': { borderColor: '#e0e0e0' }
            }
          }}
        />
        <Avatar 
          sx={{ 
            bgcolor: getAvatarColor(user?.firstName),
            width: 40,
            height: 40
          }}
        >
          {getInitials()}
        </Avatar>
      </Box>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Filter Tabs */}
      <FilterTabs onFilterChange={handleFilterChange} />

      {/* Posts Feed */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No posts yet. Be the first to share something!
          </Typography>
        </Box>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onUpdate={fetchPosts}
          />
        ))
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default SocialFeed;
