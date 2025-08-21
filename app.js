import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import groupRoutes from './routes/group/group-router.js';
import imageRoutes from './routes/images.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// ✅ 업로드 폴더 정적 제공
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 라우터 연결
app.use('/groups', groupRoutes);
app.use('/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
