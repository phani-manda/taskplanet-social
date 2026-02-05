import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  EmojiEmotions as EmojiIcon,
  FormatAlignLeft as FormatIcon,
  Campaign as PromoteIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import api from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postType, setPostType] = useState(0); // 0 = All Posts, 1 = Promotions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Please add some text or an image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);
      formData.append('isPromotion', postType === 1);

      const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setText('');
      setImage(null);
      setImagePreview(null);
      setSuccess(true);
      
      if (onPostCreated) {
        onPostCreated(response.data.post);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box component="span" fontWeight="bold" fontSize={16}>
          Create Post
        </Box>
        <Tabs 
          value={postType} 
          onChange={(e, val) => setPostType(val)}
          sx={{ minHeight: 36 }}
        >
          <Tab 
            label="All Posts" 
            sx={{ 
              minHeight: 36, 
              py: 0.5,
              fontSize: 13,
              textTransform: 'none'
            }} 
          />
          <Tab 
            label="Promotions" 
            sx={{ 
              minHeight: 36, 
              py: 0.5,
              fontSize: 13,
              textTransform: 'none'
            }} 
          />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        sx={{ mb: 2 }}
      />

      {imagePreview && (
        <Box position="relative" mb={2}>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: 200, 
              borderRadius: 8,
              objectFit: 'cover'
            }} 
          />
          <IconButton
            size="small"
            onClick={removeImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        borderTop="1px solid #e0e0e0"
        pt={2}
      >
        <Box display="flex" gap={1}>
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <IconButton component="span" color="primary" size="small">
              <CameraIcon />
            </IconButton>
          </label>
          <IconButton size="small">
            <EmojiIcon sx={{ color: '#666' }} />
          </IconButton>
          <IconButton size="small">
            <FormatIcon sx={{ color: '#666' }} />
          </IconButton>
          <Button
            size="small"
            startIcon={<PromoteIcon />}
            sx={{ color: '#1976d2', textTransform: 'none' }}
          >
            Promote
          </Button>
        </Box>

        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          onClick={handleSubmit}
          disabled={loading || (!text.trim() && !image)}
          sx={{ 
            borderRadius: 20,
            px: 3,
            bgcolor: (!text.trim() && !image) ? '#ccc' : 'primary.main'
          }}
        >
          Post
        </Button>
      </Box>

      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Post created successfully!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default CreatePost;
