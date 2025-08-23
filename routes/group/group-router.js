import express from 'express';
import {
  createGroup,
  getGroupList,
  getGroupById,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
  group_participation,
  deleteUser,
} from './group-controller.js';
import { checkGroupPassword, checkGroupUser } from '../auth.js';
import { createandupdateGroupSchema } from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';

const router = express.Router();

// 그룹 생성, 조회 라우터
router
  .route('/')
  .post(validateZod(createandupdateGroupSchema), createGroup)
  .get(getGroupList);

// 그룹 수정, 상세 조회, 삭제 라우터
router
  .route('/:groupId')
  .get(getGroupById)
  .patch(
    checkGroupPassword,
    validateZod(createandupdateGroupSchema),
    updateGroup
  )
  .delete(checkGroupPassword, deleteGroup);

// 참여, 참여 취소 라우터
router
  .route('/:groupId/participants')
  .post(group_participation)
  .delete(checkGroupUser, deleteUser);

// 좋아요, 좋아요 취소 라우터
router.route('/:groupId/likes').post(likeGroup).delete(unlikeGroup);

export default router;
