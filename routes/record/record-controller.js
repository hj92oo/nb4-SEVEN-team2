import RecordService from './record-service.js';
import Badges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 운동 기록 목록 조회
export async function getRecordList(req, res) {
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

export async function createRecord(req, res) {
  const groupId = parseInt(req.params.groupId);
  const exerciseData = req.body;

  const newRecord = await RecordService.createRecord(groupId, exerciseData);
  await Badges.recordBadges(groupId);
  res.status(201).json(newRecord);
}
