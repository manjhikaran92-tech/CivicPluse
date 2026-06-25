const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Issue = require('./models/Issue');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected for seeding...');

  await User.deleteMany();
  await Issue.deleteMany();

  const user = await User.create({
    name: 'Karan Dev',
    phone: '9800000001',
    password: 'test1234',
    city: 'Jamshedpur',
    role: 'admin'
  });

  await Issue.insertMany([
    { title: 'Large pothole on MG Road', description: 'Very dangerous pothole', category: 'pothole', severity: 'high', status: 'open', location: { lat: 22.8046, lng: 86.2029, address: 'MG Road' }, reportedBy: user._id, voteCount: 34 },
    { title: 'Streetlight not working', description: 'Dark at night', category: 'light', severity: 'medium', status: 'progress', location: { lat: 22.7994, lng: 86.1999, address: 'Bistupur' }, reportedBy: user._id, voteCount: 21 },
    { title: 'Water pipe burst', description: 'Water wasting since 2 days', category: 'water', severity: 'high', status: 'open', location: { lat: 22.8110, lng: 86.2100, address: 'NH-33' }, reportedBy: user._id, voteCount: 58 },
    { title: 'Garbage not collected', description: '3 days pending', category: 'waste', severity: 'low', status: 'resolved', location: { lat: 22.7950, lng: 86.1950, address: 'Sakchi' }, reportedBy: user._id, voteCount: 12 },
  ]);

  console.log('✅ Seed data inserted!');
  console.log('Admin login → Phone: 9800000001 | Password: test1234');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });