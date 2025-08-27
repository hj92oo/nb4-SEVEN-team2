import GroupService from './group-service.js';
import getBadges from '../badges.js';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createGroup(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const newGroup = await GroupService.createGroup(dto.body);
  res.status(201).json(newGroup);
}

export async function getGroupById(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  const group = await GroupService.getGroupById(groupId);
  res.status(200).json(group);
}

export async function getGroupList(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const { page, limit, orderBy, search } = dto.query;
  const groups = await GroupService.getGroupList(page, limit, orderBy, search);
  res.status(200).json(groups);
}

export async function updateGroup(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  const updatedGroup = await GroupService.updateGroup(groupId, dto.body);
  res.status(200).json(updatedGroup);
}
export async function deleteGroup(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  await GroupService.deleteGroup(groupId);
  res.status(204).send();
}

export async function likeGroup(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  const updated = await GroupService.likeGroup(groupId);
  await getBadges.likeBadges(groupId); // 좋아요 배지 획득
  res.status(200).json(updated);
}

export async function unlikeGroup(req, res, next) {
  validationResult(req).throw();
  const dto = req;
  const groupId = parseInt(dto.params.groupId);
  const updated = await GroupService.unlikeGroup(groupId);
  await getBadges.likeBadges(groupId); // 좋아요 배지 제거
  res.status(200).json(updated);
}
