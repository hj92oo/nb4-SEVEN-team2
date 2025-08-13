import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import groupRoutes from './routes/groups.js';
import imageRoutes from './routes/images.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ES 모듈에서 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// 업로드 폴더 정적 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우트 연결
app.use('/groups', groupRoutes);
app.use('/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
