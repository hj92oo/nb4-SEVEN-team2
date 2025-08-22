import express from 'express';
import { createExercise, getExerciseList } from './record-controller.js';
import { checkGroupUser } from '../auth.js';

const router = express.Router();

router
  .route('/:groupId/records')
  .get(getExerciseList)
  .post(checkGroupUser, createExercise);

export default router;
