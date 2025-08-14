import express from 'express';
import GroupController from './GroupController.js';
import { checkGroupPassword } from './auth.js';
import { validate } from './validation.js';

const router = express.Router();

// 그룹 생성 라우터
router.post('/', validate, GroupController.createGroup);

// 그룹 수정 라우터
router
  .route('/:groupId')
  .patch(checkGroupPassword, validate, GroupController.updateGroup)
  .delete(checkGroupPassword, GroupController.deleteGroup);

export default router;
