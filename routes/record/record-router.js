import express from 'express';
import { createRecord, getRecordList } from './record-controller.js';
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
    getRecordList
  )
  .post(
    validateZod(checkGroupIdSchema, 'params'),
    validateZod(createRecordSchema),
    checkGroupUser,
    createRecord
  );

export default router;
