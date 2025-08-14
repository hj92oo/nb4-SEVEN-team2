import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkGroupPassword = async (req, res, next) => {
  const { group, password } = req.body;
  const groupId = group?.id;
  if (!password) {
    return res.status(400).json({
      error: {
        path: 'ownerPassword',
        message: '비밀번호를 입력해 주세요.',
      },
    });
  }

  try {
    const targetGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (targetGroup.password !== password) {
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

// auth.js << 비밀번호 등 검사해야하는거를 여기에 넣으면 좋겠다
