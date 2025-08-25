
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import RecordService from './record-service.js';
import getBadges from '../badges.js';

const prisma = new PrismaClient();

export async function getExerciseList(req, res) {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { page, limit, orderBy, search } = req.query;
    const { data, total } = await RecordService.getExerciseList(
      groupId,
      {
        page,
        limit,
        orderBy,
        search,
      }
    );
    return res.status(200).json({ data, total });
  } catch (error) {
    console.error('getExerciseList Error:', error);
    return res.status(500).json({ message: '운동 기록을 불러오는 데 실패했습니다.' });
  }
}

export async function createExercise(req, res) {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const dto = { ...req.body, groupId };
    const newRecord = await RecordService.createExercise(dto);

    //운동 기록 등록 후 운동 배지 갱신
    await getBadges.exerciseBadges(groupId);
    
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('ExerciseController.createExercise Error:', error);
    res.status(500).json({ message: '운동 기록 등록에 실패했습니다.' });
  }
}

