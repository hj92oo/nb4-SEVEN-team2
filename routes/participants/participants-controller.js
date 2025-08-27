import * as ParticipantsService from './participants-service.js';
import getBadges from '../badges.js';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addUser(req, res) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  const create = await ParticipantsService.GroupParticipation(
    dto.body,
    groupId
  );
  await getBadges.participantBadges(groupId); // 참여자 수 뱃지 획득
  res.status(201).json(create);
}

export async function deleteUser(req, res) {
  validationResult(req).throw();
  const dto = req;
  const { nickname } = dto.body;
  const groupId = parseInt(dto.params.groupId);
  await ParticipantsService.deleteUser(groupId, nickname);
  await getBadges.participantBadges(groupId); // 참여자 수 뱃지 제거
  await getBadges.recordBadges(groupId); // 기록 수 배지 제거
  res.status(200).json();
}
