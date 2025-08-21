import express from 'express';
import recordExercise from './record/record-controller';

const router = express.Router()

router
    .route('/groups/{groupId}/records')
    .post(recordExercise) // 운동기록 등록
    .get() // 운동기록 목록 조회




