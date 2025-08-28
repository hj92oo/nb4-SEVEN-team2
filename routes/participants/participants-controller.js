import ParticipantsService from './participants-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ParticipantsController {
  async addUser(req, res) {
     /**     
       * #swagger.tags = ['Participants']
       * #swagger.summary = '그룹 참여'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '그룹 ID',
            required: true,
            type: 'integer',
            example: 1
        }
      * #swagger.requestBody = {
            required: true,
            content: {"application/json": {
                example: {
                  nickname: "string",
                  password: "string"
                }}}
        }
      * #swagger.responses[201] = {
            description: "그룹 참여 성공 (그룹 객체 반환)",
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
            description: "잘못된 요청",
            content: {"application/json": {
                example: {
                  path: "nickname",
                  message: "nickname is required"
                }}}}
    */
    const groupId = parseInt(req.dto.params.groupId);
    const create = await ParticipantsService.addUser(req.dto.body, groupId);
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 획득
    res.status(201).json(create);
  }

  async deleteUser(req, res) {
    /**     
       * #swagger.tags = ['Participants']
       * #swagger.summary = '그룹 참여 취소'
       * #swagger.parameters['groupId'] = {
            in: 'path',
            description: '그룹 ID',
            required: true,
            type: 'integer',
            example: 1
        }
      * #swagger.requestBody = {
            required: true,
            content: {"application/json": {
                example: {
                  nickname: "string",
                  password: "string"
                }}}
        }
      * #swagger.responses[204] = {
            description: "그룹 참여 취소 성공 (내용 없음)",
            content: {"application/json": {
                example: {}
            }}}
      * #swagger.responses[400] = {
            description: "잘못된 요청",
            content: {"application/json": {
                example: {
                  path: "nickname",
                  message: "nickname is required"
                }}}}
      * #swagger.responses[401] = {
            description: "인증 실패 (비밀번호 불일치)",
            content: {"application/json": {
                example: {
                  path: "password",
                  message: "Wrong password"
                }}}}
 */
    const { nickname } = req.dto.body;
    const groupId = parseInt(req.dto.params.groupId);
    await ParticipantsService.deleteUser(groupId, nickname);
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 제거
    await getBadges.recordBadges(groupId); // 기록 수 배지 제거
    res.status(200).json();
  }
}

export default new ParticipantsController();
