const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const PUBLIC_REGISTRATION_ROLES = ['Recruiter', 'Hiring Manager', 'Viewer'];

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'username, email, password and role are required' });
    }

    if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected for public registration' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      token: generateToken(user._id.toString(), user.role),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      token: generateToken(user._id.toString(), user.role),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login user' });
  }
}

module.exports = {
  register,
  login,
};
