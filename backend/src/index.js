import { config } from 'dotenv';
config({ override: true }); // .env file wins over stale shell env vars
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import boardRoutes from './routes/board.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});
