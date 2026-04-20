const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ensureDefaultAdmin = require('./utils/ensureDefaultAdmin');

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  await ensureDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
  });
}

startServer();
