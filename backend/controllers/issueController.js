const Issue = require('../models/Issue');
const User = require('../models/User');

// @GET /api/issues
const getIssues = async (req, res) => {
  try {
    const { category, status, lat, lng, radius = 10 } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name city points')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/issues/:id
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name city points')
      .populate('comments.user', 'name');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/issues
const createIssue = async (req, res) => {
  try {
    const { title, description, category, severity, lat, lng, address } = req.body;

    if (!title || !description || !category || !lat || !lng) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      severity: severity || 'medium',
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
      image: req.file ? `/uploads/${req.file.filename}` : null,
      reportedBy: req.user._id
    });

    // Add points to user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10, reportsCount: 1 }
    });

    const populated = await issue.populate('reportedBy', 'name city');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/issues/:id/vote
const voteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const alreadyVoted = issue.votes.includes(req.user._id);
    if (alreadyVoted) {
      issue.votes = issue.votes.filter(v => v.toString() !== req.user._id.toString());
      issue.voteCount = Math.max(0, issue.voteCount - 1);
    } else {
      issue.votes.push(req.user._id);
      issue.voteCount += 1;
      await User.findByIdAndUpdate(req.user._id, { $inc: { points: 2 } });
    }

    await issue.save();
    res.json({ voteCount: issue.voteCount, voted: !alreadyVoted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/issues/:id/status  (admin only)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = status;
    if (status === 'resolved') issue.resolvedAt = new Date();
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/issues/:id/comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.comments.push({ user: req.user._id, text });
    await issue.save();

    const updated = await Issue.findById(req.params.id).populate('comments.user', 'name');
    res.json(updated.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/issues/:id
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIssues, getIssueById, createIssue, voteIssue, updateStatus, addComment, deleteIssue };