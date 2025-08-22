import GroupService from './group-service.js';
import { getBadges } from '../badges.js';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createGroup(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const newGroup = await GroupService.createGroup(dto.body);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('GroupController.createGroup Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export async function getGroupById(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const group = await GroupService.getGroupById(groupId);
    res.status(200).json(group);
  } catch (error) {
    console.error('GroupController.getGroupById Error:', error);
    res.status(404).json({ message: '해당 그룹을 찾을 수 없습니다.' });
  }
}

export async function getGroupList(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const { offset, limit, orderBy, search } = dto.query;
    const groups = await GroupService.getGroupList(
      Number.isNaN(Number(offset)) ? 0 : Number(offset),
      Number.isNaN(Number(limit)) ? 3 : Number(limit),
      orderBy,
      search
    );
    res.status(200).json(groups);
  } catch (error) {
    console.error('GroupController.getGroupList Error:', error);
    res.status(404).json({ message: '그룹 목록 조회에 실패했습니다.' });
  }
}

export async function updateGroup(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const updatedGroup = await GroupService.updateGroup(groupId, dto.body);
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('GroupController.updateGroup Error:', error);
    res.status(500).json({ message: '그룹 수정에 실패했습니다.' });
  }
}
export async function deleteGroup(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    await GroupService.deleteGroup(groupId);
    res.status(204).send();
  } catch (error) {
    console.error('GroupController.deleteGroup Error:', error);
    res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
  }
}

export async function likeGroup(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const updated = await GroupService.likeGroup(groupId);
    await getBadges(groupId); // 좋아요 배지 획득
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.likeGroup Error:', error);
    res.status(500).json({ message: '추천에 실패했습니다.' });
  }
}

export async function unlikeGroup(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const updated = await GroupService.unlikeGroup(groupId);
    await getBadges(groupId); // 좋아요 배지 제거
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.unlikeGroup Error:', error);
    res.status(500).json({ message: '추천 취소에 실패했습니다.' });
  }
}
export async function group_participation(req, res) {
  try {
    validationResult(req).throw();
    const dto = req;
    const groupId = parseInt(dto.params.groupId);
    const create = await GroupService.GroupParticipation(dto.body, groupId);
    await getBadges(groupId); // 참여자 수 뱃지 획득
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
    await GroupService.deleteUser(groupId, nickname);
    // console.log('success');
    await getBadges(groupId); // 참여자 수 뱃지 제거
    res.status(200).json();
  } catch (error) {
    console.error('GroupController.deleteGroup Error:', error);
    res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
  }
}
