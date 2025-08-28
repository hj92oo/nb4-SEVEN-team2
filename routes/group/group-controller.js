import GroupService from './group-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

// 미사용 코드 삭제 // const prisma = new PrismaClient();

class GroupController {
  async createGroup(req, res) {
    /**     
      * #swagger.tags = ['Groups']
      * #swagger.summary = '그룹 생성'
      * #swagger.requestBody = {
           required: true,
           content: {"application/json": {
               example: {
                 name: "string",
                 description: "string",
                 photoUrl: "string",
                 goalRep: 0,
                 discordWebhookUrl: "string",
                 discordInviteUrl: "string",
                 tags: ["string"],
                 ownerNickname: "string",
                 ownerPassword: "string"
               }}}
        }
      * #swagger.responses[201] = {
           description: "그룹 생성 성공",
           content: {"application/json": {
               example: {
                 id: 0,
                 name: "string",
                 description: "string",
                 photoUrl: "string",
                 goalRep: 0,
                 discordWebhookUrl: "string",
                 discordInviteUrl: "string",
                 likeCount: 0,
                 tags: ["string"],
                 owner: {
                   id: 0,
                   nickname: "string",
                   createdAt: 0,
                   updatedAt: 0
                 },
                 participants: [{
                   id: 0,
                   nickname: "string",
                   createdAt: 0,
                   updatedAt: 0
                 }],
                 createdAt: 0,
                 updatedAt: 0,
                 badges: ["string"]
               }}}}
      * #swagger.responses[400] = {
           description: "잘못된 요청 (goalRep 타입 오류)",
           content: {"application/json": {
               example: {
                 path: "goalRep",
                 message: "goalRep must be an integer"
               }}}}
    */

    const newGroup = await GroupService.createGroup(req.dto.body);
    res.status(201).json(newGroup);
  }
  
  async updateGroup(req, res) {
      /**     
       * #swagger.tags = ['Groups']
       * #swagger.summary = '그룹 수정'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '수정할 그룹의 ID',
            required: true,
            type: 'integer',
            example: 1
        }
      * #swagger.requestBody = {
            required: true,
            content: {"application/json": {
                example: {
                  name: "string",
                  description: "string",
                  photoUrl: "string",
                  goalRep: 0,
                  discordWebhookUrl: "string",
                  discordInviteUrl: "string",
                  tags: ["string"],
                  ownerNickname: "string",
                  ownerPassword: "string"
                }}}
        }
      ** #swagger.responses[200] = {
            description: "그룹 수정 성공",
            content: {"application/json": {
                example: {
                  id: 0,
                  name: "string",
                  description: "string",
                  photoUrl: "string",
                  goalRep: 0,
                  discordWebhookUrl: "string",
                  discordInviteUrl: "string",
                  likeCount: 0,
                  tags: ["string"],
                  owner: {
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0
                  },
                  participants: [{
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0
                  }],
                  createdAt: 0,
                  updatedAt: 0,
                  badges: ["string"]
                }}}}
      * #swagger.responses[400] = {
            description: "잘못된 요청 (goalRep 타입 오류)",
            content: {"application/json": {
                example: {
                  path: "goalRep",
                  message: "goalRep must be an integer"
                }}}}
      * #swagger.responses[401] = {
            description: "인증 실패 (비밀번호 불일치)",
            content: {"application/json": {
                example: {
                  path: "password",
                  message: "Wrong password"
                }}}}
      */
    const groupId = parseInt(req.dto.params.groupId);
    const updatedGroup = await GroupService.updateGroup(groupId, req.dto.body);
    res.status(200).json(updatedGroup).send();
  }

  async deleteGroup(req, res) {
      /**     
       * #swagger.tags = ['Groups']
       * #swagger.summary = '그룹 삭제'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '삭제할 그룹 아이디',
            required: true,
            type: 'integer',
            example: 1
        }
      * #swagger.requestBody = {
            required: true,
            content: {"application/json": {
                example: {
                  ownerPassword: "string"
                }}}
        }
      * #swagger.responses[200] = {
            description: "그룹 삭제 성공",
            content: {"application/json": {
                example: {
                  ownerPassword: "string"
                }}}}
      * #swagger.responses[401] = {
            description: "인증 실패 (비밀번호 불일치)",
            content: {"application/json": {
                example: {
                  path: "password",
                  message: "Wrong password"
                }}}}
      * #swagger.responses[404] = {
            description: "그룹을 찾을 수 없음",
            content: {"application/json": {
                example: {
                  message: "Group not found"
                }}}}
      */
    const groupId = parseInt(req.dto.params.groupId);
    await GroupService.deleteGroup(groupId);
    res.status(204).send();
  }

  async likeGroup(req, res) {
      /**     
       * #swagger.tags = ['Groups']
       * #swagger.summary = '그룹 추천(좋아요)'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '그룹 ID',
            required: true,
            type: 'integer',
            example: 1
        }
      */
    const groupId = parseInt(req.dto.params.groupId);
    const updated = await GroupService.likeGroup(groupId);
    await getBadges.likeBadges(groupId);
    res.status(200).json(updated);
  }

  async unlikeGroup(req, res) {
      /**     
         * #swagger.tags = ['Groups']
         * #swagger.summary = '그룹 추천(좋아요) 취소'
         * #swagger.parameters['groupId'] = {
              in: 'path',
              description: '그룹 ID',
              required: true,
              type: 'integer',
              example: 1
          }
      */
    const groupId = parseInt(req.dto.params.groupId);
    const updated = await GroupService.unlikeGroup(groupId);
    await getBadges.likeBadges(groupId);
    res.status(200).json(updated);
  }

  async getGroupById(req, res) {
    /**     
       * #swagger.tags = ['Groups']
       * #swagger.summary = '그룹 상세 조회'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '그룹 아이디',
            required: true,
            type: 'integer',
            example: 1
        }
      * #swagger.responses[200] = {
            description: "그룹 상세 조회 성공",
            content: {"application/json": {
                example: {
                  id: 0,
                  name: "string",
                  description: "string",
                  photoUrl: "string",
                  goalRep: 0,
                  discordWebhookUrl: "string",
                  discordInviteUrl: "string",
                  likeCount: 0,
                  tags: ["string"],
                  owner: {
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0
                  },
                  participants: [{
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0
                  }],
                  createdAt: 0,
                  updatedAt: 0,
                  badges: ["string"]
                }}}}
      * #swagger.responses[404] = {
            description: "그룹을 찾을 수 없음",
            content: {"application/json": {
                example: {
                  message: "Group not found"
                }}}}
    */
    const groupId = parseInt(req.dto.params.groupId);
    const group = await GroupService.getGroupById(groupId);
    res.status(200).json(group);
  }


  async getGroupList(req, res) {
    /**
      * #swagger.tags = ['Groups']
      * #swagger.summary = '그룹 목록 조회'
      * #swagger.parameters['page'] = {
         in: 'query',
         description: '페이지 번호 (기본값: 1)',
         required: false,
         type: 'integer',
         example: 1}
      * #swagger.parameters['limit'] = {
         in: 'query',
         description: '페이지당 항목 수 (기본값: 10)',
         required: false,
         type: 'integer',
         example: 10}
      * #swagger.parameters['order'] = {
         in: 'query',
         description: '정렬 방향 (asc: 오름차순, desc: 내림차순, 기본값: desc)',
         required: false,
         type: 'string',
         enum: ['asc', 'desc'],
         example: 'desc'}
      * #swagger.parameters['orderBy'] = {
         in: 'query',
         description: '정렬 기준 (likeCount: 추천 수, participantCount: 참여자 수, createdAt: 생성일, 기본값: createdAt)',
         required: false,
         type: 'string',
         enum: ['likeCount', 'participantCount', 'createdAt'],
         example: 'createdAt'}
      * #swagger.parameters['search'] = {
         in: 'query',
         description: '그룹명으로 검색',
         required: false,
         type: 'string',
         example: '헬스 동호회'}
      * #swagger.responses[200] = {
          description: "그룹 목록 조회 성공",
          content: {"application/json": {
              example: {
                data: [{
                  id: 0,
                  name: "string",
                  description: "string",
                  photoUrl: "string",
                  goalRep: 0,
                  discordWebhookUrl: "string",
                  discordInviteUrl: "string",
                  likeCount: 0,
                  recordCount: 0,
                  tags: ["string"],
                  owner: {
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0},
                  participants: [{
                    id: 0,
                    nickname: "string",
                    createdAt: 0,
                    updatedAt: 0}],
                  createdAt: 0,
                  updatedAt: 0,
                  badges: ["string"]}],
                total: 0}}}}
      * #swagger.responses[400] = {
          description: "잘못된 요청 (orderBy 값 오류)",
          content: {"application/json": {
              example: {
                path: "orderBy",
                message: "The orderBy parameter must be one of the following values: ['likeCount', 'participantCount', 'createdAt']."}}}}
    */

    const { page, limit, orderBy, search } = req.dto.query;
    const groups = await GroupService.getGroupList(
      page,
      limit,
      orderBy,
      search
    );
    res.status(200).json(groups);
  }
}
export default new GroupController();
