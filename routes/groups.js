import express from 'express';
import { PrismaClient } from '@prisma/client';
import { checkGroupPassword } from './auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// 그룹 목록 조회
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany();
    res.json(groups);
  } catch (error) {
    console.error('GET /groups Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 생성
router.post('/', async (req, res) => {
  try {
    let {
      name,
      description,
      photoUrl,
      goalRep,
      discordWebhookUrl,
      discordInviteUrl,
      tags,
      ownerNickname,
      ownerPassword,
    } = req.body;

    if (!name || !ownerPassword || !ownerNickname) {
      // !ownerNickname 추가(심)
      return res.status(400).json({
        message:
          '필수 필드(name, ownerNickname, ownerPassword)가 누락되었습니다.',
      });
    }

    // goalRep 숫자 변환
    if (goalRep && typeof goalRep === 'string') {
      goalRep = Number(goalRep);
    }

    // 문자열 → 배열 변환 함수
    const parseArray = (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
      }
      if (Array.isArray(val)) return val;
      return [];
    };

    tags = parseArray(tags);

    const newGroup = await prisma.group.create({
      data: {
        name,
        nickname: ownerNickname,
        password: ownerPassword,
        description,
        photoUrl,
        goalRep,
        discordWebhookUrl,
        discordInviteUrl,
        tags,
      },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error('POST /groups Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router
  .route('/:groupId')
  .patch(checkGroupPassword, async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const {
      name,
      description,
      photoUrl,
      goalRep,
      discordWebhookUrl,
      discordInviteUrl,
      tags,
    } = req.body;

    try {
      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          name,
          description,
          photoUrl,
          goalRep,
          discordWebhookUrl,
          discordInviteUrl,
          tags: tags || [],
        },
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('PATCH /groups Error:', error);
      res.status(400).json({ message: '그룹 수정에 실패했습니다.' });
    }
  })

  // 그룹 상세 조회
  .get(async (req, res) => {
    const groupId = parseInt(req.params.groupId) 
    try {
      const group = await prisma.group.findUniqueOrThrow({
        where : { id: groupId },
        select: {
          name: true,
          description: true,
          nickname: true,
          photoUrl: true,
          tags: true, 
          discordInviteUrl: true, // 참여자수는 어떻게...해야 할까요.....
        }
      })
      res.status(200).json(group)
    } catch (error) {
      console.error('GET /groups Error', error)
      res.status(404).json( { message: 'Group not found' })
    }
  })

  // 그룹 삭제(심)
  .delete(checkGroupPassword, async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    try {
      await prisma.group.delete({
        where: { id: groupId },
      });
      res.status(200).json();
    } catch (error) {
      console.error('DELATE /groups Error:', error);
      res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
    }
  });


export default router;
