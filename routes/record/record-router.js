import express from 'express';
import { createExercise, getExerciseList } from './record-controller.js';
import { checkGroupUser } from '../auth.js';
import {
  createRecordSchema,
  checkGroupIdSchema,
  checkPaginationSchema,
} from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';

const router = express.Router();

router
  .route('/:groupId/records')
  .get(
    validateZod(checkGroupIdSchema, 'params'),
    validateZod(checkPaginationSchema, 'query'),
    getExerciseList
  )
  .post(
    validateZod(checkGroupIdSchema, 'params'),
    validateZod(createRecordSchema),
    checkGroupUser,
    createExercise
  );

export default router;
