import ParticipantsService from './participants-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ParticipantsController {
  async addUser(req, res) {
    const groupId = parseInt(req.params.groupId);
    const create = await ParticipantsService.addUser(req.body, groupId);
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 획득
    res.status(201).json(create);
  }

  async deleteUser(req, res) {
    const { nickname } = req.body;
    const groupId = parseInt(req.params.groupId);
    await ParticipantsService.deleteUser(groupId, nickname);
    await getBadges.participantBadges(groupId); // 참여자 수 뱃지 제거
    await getBadges.recordBadges(groupId); // 기록 수 배지 제거
    res.status(200).json();
  }
}

export default new ParticipantsController();
