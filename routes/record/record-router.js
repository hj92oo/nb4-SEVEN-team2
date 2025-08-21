import express from 'express';
import { createExercise, getExercises } from './record-controller.js';
import { checkGroupUser } from '../auth.js';

const router = express.Router();

router
  .route('/:groupId/records')
  .get(getExercises)
  .post(checkGroupUser, createExercise);

export default router;
