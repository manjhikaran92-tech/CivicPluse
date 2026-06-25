const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, city, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (city) user.city = city;
    if (email) user.email = email;
    await user.save();
    res.json({ _id: user._id, name: user.name, city: user.city, email: user.email, points: user.points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;