import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkGroupPassword = async (req, res, next) => {
  const group_id = parseInt(req.params.groupId);
  const { ownerPassword } = req.body;
  if (!ownerPassword) {
    return res.status(400).json({
      error: {
        path: 'ownerPassword',
        message: '비밀번호를 입력해 주세요.',
      },
    });
  }

  try {
    const targetGroup = await prisma.group.findUnique({
      where: { group_id : group_id , password : ownerPassword },
    });
    if (targetGroup.password !== ownerPassword) {
      return res.status(401).json({
        error: {
          path: 'ownerPassword',
          message: '비밀번호가 일치하지 않습니다.',
        },
      });
    }
    req.group = targetGroup;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: { message: 'Database error.' } });
  }
};
