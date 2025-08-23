import express from 'express';
import { validateZod } from '../../middlewares/validateZod.js';
import { checkGroupUser } from '../auth.js';
import { createRecordSchema } from '../validation.js'
import { recordExercise, listRecords } from './record-controller.js';


const router = express.Router();

router
  .route('/:groupId/records')
  .post(checkGroupUser, validateZod(createRecordSchema), recordExercise)
  .get(listRecords)
  

export default router;

