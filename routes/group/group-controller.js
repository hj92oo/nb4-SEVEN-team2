import GroupService from './group-service.js';
import getBadges from '../badges.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GroupController {
  async createGroup(req, res) {
    const newGroup = await GroupService.createGroup(req.dto.body);
    res.status(201).json(newGroup);
  }

  async updateGroup(req, res) {
    const groupId = parseInt(req.dto.params.groupId);
    const updatedGroup = await GroupService.updateGroup(groupId, req.dto.body);
    res.status(200).json(updatedGroup);
  }

  async deleteGroup(req, res) {
    const groupId = parseInt(req.dto.params.groupId);
    await GroupService.deleteGroup(groupId);
    res.status(204).send();
  }

  async likeGroup(req, res) {
    const groupId = parseInt(req.dto.params.groupId);
    const updated = await GroupService.likeGroup(groupId);
    await getBadges.likeBadges(groupId);
    res.status(200).json(updated);
  }

  async unlikeGroup(req, res) {
    const groupId = parseInt(req.dto.params.groupId);
    const updated = await GroupService.unlikeGroup(groupId);
    await getBadges.likeBadges(groupId);
    res.status(200).json(updated);
  }

  async getGroupById(req, res) {
    const groupId = parseInt(req.dto.params.groupId);
    const group = await GroupService.getGroupById(groupId);
    res.status(200).json(group);
  }

  async getGroupList(req, res) {
    const { page, limit, orderBy, search } = req.dto.query;
    const groups = await GroupService.getGroupList(
      page,
      limit,
      orderBy,
      search
    );
    res.status(200).json(groups);
  }
}
export default new GroupController();
