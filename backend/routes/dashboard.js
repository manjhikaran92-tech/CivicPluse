const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');

// @GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'open' });
    const progressIssues = await Issue.countDocuments({ status: 'progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();

    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const resolutionRate = totalIssues > 0
      ? Math.round((resolvedIssues / totalIssues) * 100)
      : 0;

    res.json({
      totalIssues,
      openIssues,
      progressIssues,
      resolvedIssues,
      totalUsers,
      resolutionRate,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/dashboard/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaders = await User.find()
      .select('name city points reportsCount badges')
      .sort({ points: -1 })
      .limit(10);
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/dashboard/recent
router.get('/recent', async (req, res) => {
  try {
    const recent = await Issue.find()
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;