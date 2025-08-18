import express from 'express';
import {
  createGroup,
  updateGroup,
  deleteGroup,
  likeGroup,
} from './group-controller.js';
import { checkGroupPassword } from './auth.js';
import { validate } from './validation.js';

const router = express.Router();

router
    .route('/')
    .get(getGroupList)
    .post(validate, createGroup);

router    
    .route('/:groupId')
    .patch(checkGroupPassword, validate, updateGroup)
    .delete(checkGroupPassword, deleteGroup);

router
    .route('/:groupId')
    .get(getGroupById)

router
    .route('/:groupId')
    .post(validate, likeGroup);

export default router;