import express from 'express';
import RecordController from './record-controller.js';
import auth from '../auth.js';
import validation from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';
import { validateRequest } from '../../middlewares/validateRequest.js';

const router = express.Router();

// 운동 기록 등록, 운동 기록 목록 조회
router
  .route('/:groupId/records')
  .get(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateZod(validation.checkPaginationSchema, 'query'),
    validateRequest,
    RecordController.getRecordList
  )
  .post(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateZod(validation.createRecordSchema),
    auth.checkGroupUser,
    validateRequest,
    RecordController.createRecord
  );

// 랭킹
router
  .route('/:groupId/rank')
  .get(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateZod(validation.checkDurationSchena, 'query'),
    validateRequest,
    RecordController.ranking
  );

export default router;
