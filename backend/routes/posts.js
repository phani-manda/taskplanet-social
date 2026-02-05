const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// @route   GET /api/posts
// @desc    Get all posts (public feed)
// @access  Public (but auth optional for personalization)
router.get('/', async (req, res) => {
  try {
    const { filter, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let sortOptions = { createdAt: -1 }; // Default: newest first

    // Apply filters
    if (filter === 'most-liked') {
      sortOptions = { likes: -1, createdAt: -1 };
    } else if (filter === 'most-commented') {
      sortOptions = { comments: -1, createdAt: -1 };
    } else if (filter === 'most-shared') {
      sortOptions = { shares: -1, createdAt: -1 };
    }

    const posts = await Post.find()
      .populate('user', 'firstName lastName username avatar')
      .populate('comments.user', 'firstName lastName username avatar')
      .populate('likes', 'firstName lastName username')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// @route   GET /api/posts/search
// @desc    Search posts
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const posts = await Post.find({
      $or: [
        { text: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('user', 'firstName lastName username avatar')
      .populate('comments.user', 'firstName lastName username avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ posts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text, isPromotion } = req.body;
    
    // At least text or image is required
    if (!text && !req.file) {
      return res.status(400).json({ message: 'Post must have text or image' });
    }

    const postData = {
      user: req.user._id,
      text: text || '',
      isPromotion: isPromotion === 'true'
    };

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = new Post(postData);
    await post.save();

    // Populate user data before sending response
    await post.populate('user', 'firstName lastName username avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   PUT /api/posts/:postId/like
// @desc    Like/Unlike a post
// @access  Private
router.put('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      liked: !isLiked,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:postId/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      text: text.trim()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment's user data
    await post.populate('comments.user', 'firstName lastName username avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
      commentCount: post.comments.length
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @route   GET /api/posts/:postId/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments.user', 'firstName lastName username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      comments: post.comments,
      commentCount: post.comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private (only post owner)
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

module.exports = router;
