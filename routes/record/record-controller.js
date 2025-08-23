import { createRecord, getRecordList } from './record-service.js';
import { getBadges } from '../badges.js';

// 1. 운동 기록 등록
export const recordExercise = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const newRecord = await createRecord(groupId, req.body);

    // 운동 기록 뱃지 갱신 ~.~
    await getBadges(groupId);

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('recordExercise Error:', error);
    res.status(500).json({ message: '운동 기록 등록에 실패!' });
  }
};

// 2. 운동 기록 목록 조회
export const listRecords = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { page, limit, orderBy, search } = req.query;
    const { data, total } = await getRecordList(
      groupId,
      {
        page,
        limit,
        orderBy,
        search,
      }
    );
    return res.status(200).json({ data, total });
  } catch (error) {
    console.error('listRecords Error:', error);
    return res.status(500).json({ message: '운동 기록 조회 실패 !' });
  }
};
