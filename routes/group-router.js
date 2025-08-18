import express from  'express'
import groupController from './group-controller'
import { getPriority } from 'os'

const router = express.Router()

router
    .route('/:groupId')
    .get(groupController.getGroupById)

export default router;