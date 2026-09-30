const express = require('express');
const {getComments, createComment, deleteComment, getPostComments} = require('../controllers/comment.controller.js');

const router = express.Router();

// Get all comments
router.get('/', getComments);

// Get comments for a specific post
router.get('/:id', getPostComments);

// Create comment
router.post('/create', createComment);

// Delete comment
router.delete('/delete/:id', deleteComment);

module.exports = router;