import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import groupRoutes from './routes/group/group-router.js';
import recordRoutes from './routes/record/record-router.js';
import imageRoutes from './routes/images.js';

const app = express();

const PORT = process.env.PORT || 3001;

// 상태코드 등 체크
app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const end = process.hrtime(start);
    const duration = (end[0] * 1e9 + end[1]) / 1e6;

    console.log(
      `[백엔드] ${req.method} ${req.originalUrl} ${
        res.statusCode
      } in ${duration.toFixed(0)}ms`
    );
  });

  next();
});

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
app.use('/groups', recordRoutes);
app.use('/groups', groupRoutes);
app.use('/images', imageRoutes);
app.use('/groups/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
