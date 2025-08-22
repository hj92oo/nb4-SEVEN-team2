// import express from 'express';
// import recordExercise from './record-controller';

// const router = express.Router()

// router
//     .route('/groups/{groupId}/records')
//     .post(recordExercise) // 운동기록 등록
//     .get() // 운동기록 목록 조회


// export default router

import express from 'express';
import { createExercise, getExerciseList } from './record-controller.js';
import { checkGroupUser } from '../auth.js';
import { createRecordSchema } from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';

const router = express.Router();

router
  .route('/:groupId/records')
  .get(getExerciseList)
  .post(checkGroupUser, validateZod(createRecordSchema), createExercise);

export default router;