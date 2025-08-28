import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import groupRoutes from './routes/group/group-router.js';
import recordRoutes from './routes/record/record-router.js';
import imageRoutes from './routes/images.js';
import errorHandler from './middlewares/errorHandler.js';
import { body, validationResult } from 'express-validator';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

console.log('현재 NODE_ENV:', process.env.NODE_ENV);

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

/* cors 로컬 환경에서 프론트와 통신 가능하도록 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);  */

// CORS 설정

const allowedOrigins = [
  'http://localhost:3000',
  'https://nb4-seven-team2.onrender.com', // 배포된 프론트
];

app.use(cors({
  origin: function(origin, callback)
   {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json({ limit: '10mb' }));

// ✅ 업로드 폴더 정적 제공
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// 라우터 연결
app.use('/groups', recordRoutes);
app.use('/groups', groupRoutes);
app.use('/images', imageRoutes);

app.use(errorHandler);
// Swagger JSON 읽기
const swaggerFile = JSON.parse(
  fs.readFileSync(new URL('./swagger/swagger-output.json', import.meta.url))
);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
