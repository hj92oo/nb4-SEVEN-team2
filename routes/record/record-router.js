import express from 'express';
import {
  getRecordList,
  createRecord
} from './record-controller.js';
import { checkGroupPassword } from '../auth.js';
import { createandupdateGroupSchema } from '../validation.js'
import { validateZod } from '../../middlewares/validateZod.js'

const router = express.Router();



router
  .route('/:groupId/records')
  .get(getRecordList)
  .post(createRecord);

export default router;
