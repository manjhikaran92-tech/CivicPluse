const express = require('express');
const router = express.Router();
const {
  getIssues, getIssueById, createIssue,
  voteIssue, updateStatus, addComment, deleteIssue
} = require('../controllers/issueController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getIssues);
router.get('/:id', getIssueById);
router.post('/', protect, upload.single('image'), createIssue);
router.put('/:id/vote', protect, voteIssue);
router.put('/:id/status', protect, adminOnly, updateStatus);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deleteIssue);

module.exports = router;