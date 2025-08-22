// import express from 'express';
// import { recordExercise, listRecords } from './record-controller.js';
// import { checkGroupUser } from '../auth.js';
// import { createExerciseSchema } from '../validation.js';
// import { validateZod } from '../../middlewares/validateZod.js';

// const router = express.Router();

// // 운동 기록 등록/조회 라우트
// router
//   .route('/:groupId/records')
//   .post(checkGroupUser, validateZod(createExerciseSchema), recordExercise)
//   .get(listRecords);

// export default router;

//////////////////////////////






// import express from 'express';
// import { createExercise, getExerciseList } from './record-controller.js';
// import { checkGroupUser } from '../auth.js';
// import { createRecordSchema } from '../validation.js';
// import { validateZod } from '../../middlewares/validateZod.js';

// const router = express.Router();

// router
//   .route('/:groupId/records')
//   .get(getExerciseList)
//   .post(checkGroupUser, validateZod(createRecordSchema), createExercise);

// export default router;