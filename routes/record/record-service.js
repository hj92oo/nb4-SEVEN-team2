// //기록 등록
// "닉네임, 운동 종류(달리기, 자전거, 수영), 설명, 시간, 거리,  사진(여러장 가능), 비밀번호를 입력하여 운동 기록을 등록합니다."
// 타이머를 통해 측정된 실제 운동한 만큼의 시간만 입력 가능합니다.
// 닉네임, 비밀번호를 확인하여 그룹에 등록된 유저일 때만 기록 등록이 가능합니다.

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const createRecord = async (data) => { 
  const {
    nickname,
    password,
    exerciseType,
    description,
    time,
    distance,
    photos, 
  } = req.body

  // 닉네임으로 사용자 찾기
  const groupUser = await prisma.groupUser.findFirst({
    where: {
      nickname: nickname,
    },
  });

  // 닉네임이 없을 경우 에러 처리 
  if (!groupUser) {
    throw new Error('no user');
  }

  // 비밀번호 일치 비교 
  if (password !== groupUser.password) {
    throw new Error('password mismatch'); 
  }
  
  // 운동 기록 생성
  const newRecord = await prisma.exercise.create({ 
    data: {
      group_user_id: groupUser.participant_id,
      group_id: groupUser.group_id,
      exerciseType: exerciseType,
      description: description,
      time: time ? parseInt(time, 10) : null,
      distance: distance ? parseInt(distance, 10) : null,
      photos: photos ? photos.map(file => file.path) : [],
    }
  });

  return newRecord; // 변수명 일치
};