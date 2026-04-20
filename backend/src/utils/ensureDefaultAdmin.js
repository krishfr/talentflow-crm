const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DEFAULT_ADMIN = {
  username: 'System Admin',
  email: 'admin@talentflow.com',
  password: 'Admin@123',
  role: 'Admin',
};

async function ensureDefaultAdmin() {
  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  const result = await User.updateOne(
    { email: DEFAULT_ADMIN.email },
    {
      $setOnInsert: {
        username: DEFAULT_ADMIN.username,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        role: DEFAULT_ADMIN.role,
      },
    },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    console.log(`Default admin user created: ${DEFAULT_ADMIN.email}`);
  }
}

module.exports = ensureDefaultAdmin;
