// import { createRecord, getRecordList } from './record-service.js';

// // 1. 운동 기록 등록
// export const recordExercise = async (req, res) => { 
//   const groupId = parseInt(req.params.groupId);

//   try {
//     const newRecord = await createRecord(groupId, req.body);
//     res.status(201).json(newRecord); 
//   } catch (err) {
//     res.status(err.message === 'no user' ? 404 : err.message === 'password mismatch' ? 401 : 500)
//        .json({ message: err.message });
//   }
// };

// // 2. 운동 기록 목록 조회
// export const listRecords = async (req, res) => { 
//   const groupId = parseInt(req.params.groupId);
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const orderBy = req.query.orderBy;
//   const search = req.query.search;

//   try {
//     const records = await getRecordList(groupId, { page, limit, orderBy, search });
//     res.status(200).json(records); 
//   } catch (err) {
//     console.error(err); // 로그 추가
//     res.status(500).json({ message: '운동 기록 조회 실패' });
//   }
// };

///////////////////






// export async function createExercise(req, res) {
//   const groupId = parseInt(req.params.groupId);
//   const exerciseData = req.body;

//   try {
//     const newRecord = await RecordService.createExercise(groupId, exerciseData);
//     await getBadges(groupId);
//     res.status(201).json(newRecord);
//   } catch (error) {
//     console.error('ExerciseController.createExercise Error:', error);
//     res.status(500).json({ message: '운동 기록 등록에 실패했습니다.' });
//   }
// }

// export async function getExerciseList(req, res) {
//   const groupId = parseInt(req.params.groupId);
//   const { search, orderBy, page, limit } = req.query;
//   try {
//     const records = await RecordService.getExerciseList(groupId, {
//       search,
//       orderBy,
//       page,
//       limit,
//     });
//     res.status(200).json(records);
//   } catch (error) {
//     console.error('ExerciseController.getExercise Error:', error);
//     res.status(500).json({ message: '운동 기록을 불러오는 데 실패했습니다.' });
//   }
// }