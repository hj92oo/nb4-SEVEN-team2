import express from 'express';
import {
  createExercise,
  getExerciseList
} from './record-controller.js';
import { checkGroupUser } from '../auth.js';
import { createRecordSchema } from '../validation.js'
import { validateZod } from '../../middlewares/validateZod.js'

const router = express.Router();



router
  .route('/:groupId/records')
  .get(getExerciseList)
  .post(checkGroupUser, validateZod(createRecordSchema), createExercise);

export default router;
