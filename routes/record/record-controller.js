import { createRecord } from '../record-service.js'
import { ExerciseType } from '@prisma/client'

export const recordExercise = async (req, res) => {
  const {
    nickname,
    password,
    exerciseType,
    description,
    time,
    distance,
    } = req.body;
  

  // 필수 입력값 유효성 검사 
  if (!nickname || !password || !exerciseType) {
    return res.status(400).json({
      message: '닉네임, 비밀번호, 운동 종류는 필수 입력값입니다.',
    });
  }

  // 운동 종류 유효성 검사 (예시 사이트 보니까.. 굳이 필요 없을 거 같음....)
//   if (!Object.values(ExerciseType).includes(exerciseType)) {
//     return res.status(400).json({
//       message: 'RUN, BIKE, SWIM 중 운동을 선택해 주세요.',
//     });
//   }
  

  try {
    const newExercise = await createRecord({
      nickname,
      password,
      exerciseType,
      description,
      time,
      distance,
    });

    res.status(201).json({
      message: '운동 기록이 성공적으로 등록되었습니다.',
      data: newExercise,
    });
  } catch (error) {
    if (error.message === 'no user') {
      return res.status(404).json({ message: '해당 닉네임을 가진 사용자를 찾을 수 없습니다.' });
    }
    if (error.message === 'password mismatch') {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    console.error('운동 기록 등록 실패:', error);
    res.status(500).json({
      message: '운동 기록 등록 중 서버 오류가 발생했습니다.',
      error: error.message,
    });
  }
};