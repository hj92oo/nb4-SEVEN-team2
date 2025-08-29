import RecordService from './record-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RecordController {
  async getRecordList(req, res) {
    /**
        * #swagger.tags = ['Records']
        * #swagger.summary = '그룹 운동 기록 목록 조회'
        * #swagger.parameters['groupId'] = { in: 'path', required: true, type: 'integer' }
        * #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer' }
        * #swagger.parameters['limit'] = { in: 'query', required: false, type: 'integer' }
        * #swagger.parameters['order'] = { in: 'query', required: false, type: 'string', enum: ['asc', 'desc'] }
        * #swagger.parameters['orderBy'] = { in: 'query', required: false, type: 'string', enum: ['time', 'createdAt'] }
        * #swagger.parameters['search'] = { in: 'query', required: false, type: 'string' }
        * #swagger.responses[200] = {
            content: {
              "application/json": {
                example: {
                  data: [{
                    id: 0,
                    exerciseType: "run",
                    description: "러닝 5km",
                    time: 30,
                    distance: 5,
                    photos: ["run_1.jpg"],
                    author: { id: 1, nickname: "홍길동" }
                  }],
              total: 1
            }
          }
        }
      }
        * #swagger.responses[400] = {
            description: '잘못된 요청',
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      path: { type: "string", example: "groupId" },
                      message: { type: "string", example: "groupId must be integer" }
                    }
                  }
                }
              }
            }
          }
    */
    const groupId = parseInt(req.params.groupId, 10);
    const { page, limit, orderBy, search } = req.query;
    const { data, total } = await RecordService.getRecordList(groupId, {
      page,
      limit,
      orderBy,
      search,
    });
    return res.status(200).json({ data, total });
  }

  async createRecord(req, res) {
    /**     
     * #swagger.tags = ['Records']
     * #swagger.summary = '그룹 운동 기록 생성'
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
                exerciseType: "run",
                description: "string",
                time: 0,
                distance: 0,
                photos: ["string"],
                authorNickname: "string",
                authorPassword: "string"
              }}}
        }
      * #swagger.responses[201] = {
          description: "생성된 그룹 운동 기록 객체",
          content: {"application/json": {
              example: {
                id: 0,
                exerciseType: "run",
                description: {},
                time: 0,
                distance: 0,
                photos: ["string"],
                author: {
                  id: 0,
                  nickname: "string"
                }
              }}}}
        * #swagger.responses[400] = {
              description: "잘못된 요청",
              content: {"application/json": {
                  example: {
                path: "groupId",
                message: "groupId must be integer"
              }}}}
      */
    const groupId = parseInt(req.params.groupId);
    const exerciseData = req.body;
    const newRecord = await RecordService.createRecord(groupId, exerciseData);
    await getBadges.recordBadges(groupId);
    res.status(201).json(newRecord);
  }

  async ranking(req, res) {
    /** 
        * #swagger.tags = ['Records']
        * #swagger.summary = '그룹 랭킹 조회'
        * #swagger.parameters['groupId'] = {
                in: 'path',
                description: '그룹 ID',
                required: true,
                type: 'integer',
                example: 1}
        * #swagger.parameters['duration'] = {
              in: 'query',
              description: '랭킹 조회 기준 기간 (monthly: 월간 / weekly: 주간)',
              required: true,
              type: 'string',
              example: 'monthly'}
        * #swagger.responses[200] = {
              description: '그룹 랭킹 조회 성공',
              schema: [{
                participantId: 0,
                nickname: "string",
                recordCount: 0,
                recordTime: 0}]}
        * #swagger.responses[400] = {
              description: '잘못된 요청',
              schema: {
                path: "groupId",
                message: "groupId must be integer"
              }}
    */
    const group_id = parseInt(req.params.groupId);
    const day = req.query.duration;
    const result = await RecordService.selectRecord(group_id, day);
    res.status(200).json(result);
  }
}

export default new RecordController();
