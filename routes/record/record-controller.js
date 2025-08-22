import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import RecordService from './record-service.js';
const prisma = new PrismaClient();

export async function getRecordList(req, res) {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { page = 1, limit=6, orderBy, search } = req.query;
    const { data, total } = await RecordService.getRecordList(
      groupId,
      {
        page,
        limit,
        orderBy,
        search,
      }
    );
    return res.json({ data, total });
  } catch (error) {
    console.error('getexercise Error:', error);
    return res.status(500).json({ message: '레코드 조회 중 오류가 발생했습니다.' });
  }
}

export async function createRecord(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayErrors = Array.isArray(errors.array()) ? errors.array() : [];
    return res.status(400).json({ errors: arrayErrors });
  }
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const dto = { ...req.body, groupId };
    const newRecord = await RecordService.createRecord(dto);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('RecordController.createRecord Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}