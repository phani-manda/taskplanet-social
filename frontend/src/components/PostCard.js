import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  Collapse,
  Divider,
} from '@mui/material';
import {
  FavoriteBorder as LikeOutlineIcon,
  Favorite as LikeFilledIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.some(like => like._id === user?.id || like === user?.id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleString('en-US', options).replace(',', ' •');
  };

  const handleLike = async () => {
    try {
      const response = await api.put(`/posts/${post._id}/like`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        text: newComment.trim()
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const isOwnPost = post.user?._id === user?.id;

  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: getAvatarColor(post.user?.firstName),
              width: 48,
              height: 48
            }}
          >
            {getInitials(post.user?.firstName, post.user?.lastName)}
          </Avatar>
        }
        action={
          !isOwnPost && (
            <Button
              variant="contained"
              size="small"
              sx={{ 
                borderRadius: 20,
                textTransform: 'none',
                px: 2.5
              }}
            >
              Follow
            </Button>
          )
        }
        title={
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography fontWeight="bold" component="span">
              {post.user?.firstName} {post.user?.lastName}
            </Typography>
            <Typography color="text.secondary" component="span" fontSize={14}>
              @{post.user?.username}
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.createdAt)}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      {post.text && (
        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <CardMedia
          component="img"
          image={`${API_URL}${post.image}`}
          alt="Post image"
          sx={{ 
            maxHeight: 400,
            objectFit: 'cover'
          }}
        />
      )}

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box display="flex" alignItems="center" gap={3}>
          {/* Like */}
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleLike} size="small">
              {liked ? (
                <LikeFilledIcon sx={{ color: '#e91e63' }} />
              ) : (
                <LikeOutlineIcon />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>

          {/* Comment */}
          <Box display="flex" alignItems="center">
            <IconButton 
              onClick={() => setShowComments(!showComments)} 
              size="small"
            >
              <CommentIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {comments.length}
            </Typography>
          </Box>

          {/* Share */}
          <Box display="flex" alignItems="center">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.shares || 0}
            </Typography>
          </Box>
        </Box>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box p={2}>
          {/* Comment Input */}
          <Box display="flex" gap={1} mb={2}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: getAvatarColor(user?.firstName),
                fontSize: 12
              }}
            >
              {getInitials(user?.firstName, user?.lastName)}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    size="small" 
                    onClick={handleComment}
                    disabled={!newComment.trim() || loading}
                  >
                    <SendIcon fontSize="small" color="primary" />
                  </IconButton>
                ),
                sx: { borderRadius: 20, pr: 1 }
              }}
            />
          </Box>

          {/* Comments List */}
          {comments.map((comment, index) => (
            <Box key={comment._id || index} display="flex" gap={1} mb={1.5}>
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28,
                  bgcolor: getAvatarColor(comment.user?.firstName),
                  fontSize: 11
                }}
              >
                {getInitials(comment.user?.firstName, comment.user?.lastName)}
              </Avatar>
              <Box 
                sx={{ 
                  bgcolor: '#f0f2f5', 
                  borderRadius: 2, 
                  px: 1.5, 
                  py: 1,
                  flexGrow: 1
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {comment.user?.firstName} {comment.user?.lastName}
                </Typography>
                <Typography variant="body2">
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))}

          {comments.length === 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center"
            >
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
