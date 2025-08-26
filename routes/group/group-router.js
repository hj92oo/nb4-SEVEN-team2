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
import {
  group_participation,
  deleteUser,
} from '../participants/participants-controller.js';
import {
  checkGroupPassword,
  checkGroupUser,
  checkNicknameDuplicate,
} from '../auth.js';
import {
  createandupdateGroupSchema,
  groupNickAndPwdSchema,
  checkPaginationSchema,
  checkGroupIdSchema,
} from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';

const router = express.Router();

// 그룹 생성, 조회 라우터
router
  .route('/')
  .post(validateZod(createandupdateGroupSchema), createGroup)
  .get(validateZod(checkPaginationSchema, 'query'), getGroupList);

// 그룹 수정, 상세 조회, 삭제 라우터
router
  .route('/:groupId')
  .get(validateZod(checkGroupIdSchema, 'params'), getGroupById)
  .patch(
    validateZod(createandupdateGroupSchema),
    checkGroupPassword,
    updateGroup
  )
  .delete(
    validateZod(checkGroupIdSchema, 'params'),
    checkGroupPassword,
    deleteGroup
  );

// 참여, 참여 취소 라우터
router
  .route('/:groupId/participants')
  .post(
    validateZod(groupNickAndPwdSchema),
    checkNicknameDuplicate,
    group_participation
  )
  .delete(validateZod(groupNickAndPwdSchema), checkGroupUser, deleteUser);

// 좋아요, 좋아요 취소 라우터
router
  .route('/:groupId/likes')
  .post(validateZod(checkGroupIdSchema, 'params'), likeGroup)
  .delete(validateZod(checkGroupIdSchema, 'params'), unlikeGroup);

export default router;
