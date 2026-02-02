const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password, adminCode } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email }).catch(() => null);
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const role = (adminCode && process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE) ? 'ADMIN' : 'USER';

  // Create user using Mongoose
  const user = await User.create({ name, email, passwordHash, role });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

module.exports = { register, login };
