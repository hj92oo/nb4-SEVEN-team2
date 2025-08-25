import * as ParticipantsService from './participants-service.js';
import getBadges from '../badges.js';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function group_participation(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const create = await ParticipantsService.GroupParticipation(dto.body, groupId);
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 획득
    res.status(201).json(create);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: '그룹 참여 중 오류가 발생했습니다.',
      detail: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const { nickname } = dto.body;
    const groupId = parseInt(dto.params.groupId);
    await ParticipantsService.deleteUser(groupId, nickname);
    console.log('success');
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 제거
    res.status(200).json();
  } catch (error) {
    console.error('GroupController.deleteGroup Error:', error);
    res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
  }
}