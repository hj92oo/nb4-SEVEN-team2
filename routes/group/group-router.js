import express from 'express';
import GroupController from './group-controller.js';
import ParticipantsController from '../participants/participants-controller.js';
import auth from '../auth.js';
import validation from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';
import { validateRequest } from '../../middlewares/validateRequest.js';

const router = express.Router();

// 그룹 생성, 조회 라우터
router
  .route('/')
  .post(
    validateZod(validation.createandupdateGroupSchema),
    validateRequest,
    GroupController.createGroup
  )
  .get(
    validateZod(validation.checkPaginationSchema, 'query'),
    validateRequest,
    GroupController.getGroupList
  );

// 그룹 수정, 상세 조회, 삭제 라우터
router
  .route('/:groupId')
  .get(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateRequest,
    GroupController.getGroupById
  )
  .patch(
    validateZod(validation.createandupdateGroupSchema),
    auth.checkGroupPassword,
    validateRequest,
    GroupController.updateGroup
  )
  .delete(
    validateZod(validation.checkGroupIdSchema, 'params'),
    auth.checkGroupPassword,
    validateRequest,
    GroupController.deleteGroup
  );

// 참여, 참여 취소 라우터
router
  .route('/:groupId/participants')
  .post(
    validateZod(validation.groupNickAndPwdSchema),
    auth.checkNicknameDuplicate,
    validateRequest,
    ParticipantsController.addUser
  )
  .delete(
    validateZod(validation.groupNickAndPwdSchema),
    auth.checkGroupUser,
    validateRequest,
    ParticipantsController.deleteUser
  );

// 좋아요, 좋아요 취소 라우터
router
  .route('/:groupId/likes')
  .post(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateRequest,
    GroupController.likeGroup
  )
  .delete(
    validateZod(validation.checkGroupIdSchema, 'params'),
    validateRequest,
    GroupController.unlikeGroup
  );

export default router;
