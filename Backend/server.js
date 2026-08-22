import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './src/config/db.js';

import datasetRoutes from './src/routes/admin/manageDataRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import businessRoutes from './src/routes/businessRoutes.js';
import aiRoutes from './src/routes/admin/aiRoutes.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:8080,http://127.0.0.1:8080,http://localhost:8081,http://127.0.0.1:8081,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api/auth", authRoutes);
app.use("/api", businessRoutes);

app.use(express.static(path.join(__dirname, "public")));


app.use("/api", datasetRoutes);
app.use("/api/ai", aiRoutes);


app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
