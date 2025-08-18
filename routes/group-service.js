import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GroupService {
  async createGroup(data) {
    const { name, ownerNickname, ownerPassword } = data;

    if (!name || !ownerNickname || !ownerPassword) {
      throw new Error('필수 필드가 누락되었습니다.');
    }

    const newGroup = await prisma.group.create({ data });
    return newGroup;
  }

  async updateGroup(groupId, data) {
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data,
    });
    return updatedGroup;
  }

  async deleteGroup(groupId) {
    await prisma.group.delete({
      where: { id: groupId },
    });
    return;
  }

  async getGroupList(offset = 0, limit = 3, order = 'newest', search) {
    let orderBy;
    switch (order) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }
    const where = search ? {
      OR: [
        { name: { contains: String(search), mode: 'insensitive' } }
      ]
    } : {};
    const groups = await prisma.group.findMany({
      where,
      orderBy,
      skip: Number(offset),
      take: Number(limit),
    });
    return groups;
  }

  async getGroupById(groupId) {
    const group = await prisma.group.findUniqueOrThrow ({
      where: { id: groupId },
      select: {
        name: true,
        description: true,
        nickname: true,
        photoUrl: true,
        tags: true,
        discordInviteUrl: true, // 참여자수 추가하기
      },
    })
    return group
  }
}

export default new GroupService();
