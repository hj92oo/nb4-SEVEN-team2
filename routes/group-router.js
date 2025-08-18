import express from 'express';
import {
  createGroup,
  getGroupList,
  getGroupById,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
} from './group-controller.js';
import { checkGroupPassword } from './auth.js';
import { validateGroup } from './validation.js';

const router = express.Router();

// 그룹 생성 라우터
router.route('/').post(validateGroup, createGroup).get(getGroupList);

// 그룹 수정 라우터
router
  .route('/:groupId')
  .get(getGroupById)
  .patch(checkGroupPassword, validateGroup, updateGroup)
  .delete(checkGroupPassword, deleteGroup);

router.route('/:groupId/likes').post(likeGroup).delete(unlikeGroup);

export default router;
