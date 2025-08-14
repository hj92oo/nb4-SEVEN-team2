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
}

export default new GroupService();
