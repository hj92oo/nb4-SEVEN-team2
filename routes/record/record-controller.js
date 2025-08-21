import RecordService from './record-service.js';
import { getBadges } from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createExercise(req, res) {
  const groupId = parseInt(req.params.groupId);
  const exerciseData = req.body;

  try {
    const newRecord = await RecordService.createExercise(groupId, exerciseData);
    await getBadges(groupId);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('ExerciseController.createExercise Error:', error);
    res.status(500).json({ message: '운동 기록 등록에 실패했습니다.' });
  }
}

export async function getExercises(req, res) {
  const groupId = parseInt(req.params.groupId);
  const { search, orderBy, page, limit } = req.query;
  try {
    const records = await RecordService.getExercises(groupId, {
      search,
      orderBy,
      page,
      limit,
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('ExerciseController.getExercise Error:', error);
    res.status(500).json({ message: '운동 기록을 불러오는 데 실패했습니다.' });
  }
}
