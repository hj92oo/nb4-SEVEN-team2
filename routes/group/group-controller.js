import GroupService from './group-service.js';
import { getBadges } from '../badges.js';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createGroup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayErrors = Array.isArray(errors.array()) ? errors.array() : [];
    return res.status(400).json({ errors: arrayErrors });
  }
  try {
    const dto = req.body;
    const newGroup = await GroupService.createGroup(dto);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('GroupController.createGroup Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export async function getGroupById(req, res) {
  try {
    const groupId = parseInt(req.params.groupId);
    const group = await GroupService.getGroupById(groupId);
    res.status(200).json(group);
  } catch (error) {
    console.error('GroupController.getGroupById Error:', error);
    res.status(404).json({ message: '해당 그룹을 찾을 수 없습니다.' });
  }
}

export async function getGroupList(req, res) {
  try {
    const { offset, limit, orderBy, search } = req.query;
    const groups = await GroupService.getGroupList(
      Number.isNaN(Number(offset)) ? 0 : Number(offset),
      Number.isNaN(Number(limit)) ? 3 : Number(limit),
      orderBy,
      search
    );
    res.status(200).json({ data: groups });
  } catch (error) {
    console.error('GroupController.getGroupList Error:', error);
    res.status(404).json({ message: '그룹 목록 조회에 실패했습니다.' });
  }
}

export async function updateGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayErrors = Array.isArray(errors.array()) ? errors.array() : [];
    return res.status(400).json({ errors: arrayErrors });
  }
  try {
    const dto = req.body;
    const updatedGroup = await GroupService.updateGroup(groupId, dto);
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('GroupController.updateGroup Error:', error);
    res.status(500).json({ message: '그룹 수정에 실패했습니다.' });
  }
}

export async function deleteGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const result = await GroupService.deleteGroup(groupId);
    res.status(200).json(result);
  } catch (error) {
    console.error('GroupController.deleteGroup Error:', error);
    res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
  }
}

export async function likeGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const updated = await GroupService.likeGroup(groupId);
    await getBadges(groupId); // 좋아요 배지 획득
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.likeGroup Error:', error);
    res.status(500).json({ message: '추천에 실패했습니다.' });
  }
}

export async function unlikeGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const updated = await GroupService.unlikeGroup(groupId);
    await getBadges(groupId); // 좋아요 배지 제거
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.unlikeGroup Error:', error);
    res.status(500).json({ message: '추천 취소에 실패했습니다.' });
  }
}
export async function group_participation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayErrors = Array.isArray(errors.array()) ? errors.array() : [];
    return res.status(400).json({ errors: arrayErrors });
  }

  try {
    const dto = req.body;
    const groupId = parseInt(req.params.groupId, 10);
    await GroupService.checkAndAwardBadges(groupId);  // 참여자 수 뱃지 획득

    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }
    const create = await GroupService.GroupParticipation(dto, groupId);

    res.status(201).json(create);
  } catch (error) {
    console.error(error); 

    res.status(500).json({
      message: "그룹 참여 중 오류가 발생했습니다.",
      detail: error.message
    });
  }
}


// 임시용
export async function getRecords(req, res) {
  const groupId = parseInt(req.params.groupId);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: '잘못된 그룹 ID입니다.' });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { group_id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: '해당 그룹을 찾을 수 없습니다.' });
    }

    const exercise = await prisma.exercise.findMany({
      where: { group_id: groupId },
    });

    return res.json(exercise);
  } catch (error) {
    console.error('getexercise Error:', error);
    return res
      .status(500)
      .json({ message: '레코드 조회 중 오류가 발생했습니다.' });
  }
}
