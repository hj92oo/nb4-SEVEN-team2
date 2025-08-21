import express from 'express';
import {
  createGroup,
  getGroupList,
  getGroupById,
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup,
  getRecords,
  group_participation,
  deleteUser,
} from './group-controller.js';
import { checkGroupPassword, checkGroupUser } from '../auth.js';
import { createandupdateGroupSchema } from '../validation.js';
import { validateZod } from '../../middlewares/validateZod.js';

const router = express.Router();

// 그룹 생성 라우터
router.route('/').post(validateZod(createandupdateGroupSchema) , createGroup).get(getGroupList);


// 그룹 수정 라우터
router
  .route('/:groupId')
  .get(getGroupById)
  .patch(checkGroupPassword, validateZod(createandupdateGroupSchema), updateGroup)
  .delete(checkGroupPassword, deleteGroup);

router
  .route('/:groupId/records')
  .get(getRecords)
router
  .route('/:groupId/participants')
  .post(group_participation)
  .delete(checkGroupUser, deleteUser)

  router
  .route('/:groupId/likes')
  .post(likeGroup)
  .delete(unlikeGroup);

export default router;