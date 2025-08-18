import express from  'express'
import groupController from './group-controller'


const router = express.Router()

router
    .route('/')
    .get(groupController.getGroupList)

router    
    .route('/:groupId')
    .get(groupController.getGroupById)

export default router;