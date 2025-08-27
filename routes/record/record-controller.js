import RecordService from './record-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RecordController {
  async getRecordList(req, res) {
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
    const groupId = parseInt(req.params.groupId);
    const exerciseData = req.body;
    const newRecord = await RecordService.createRecord(groupId, exerciseData);
    await getBadges.recordBadges(groupId);
    res.status(201).json(newRecord);
  }

  async ranking(req, res) {
    const group_id = parseInt(req.params.groupId);
    const day = req.query.duration;
    const result = await RecordService.selectRecord(group_id, day);
    res.status(200).json(result);
  }
}

export default new RecordController();
