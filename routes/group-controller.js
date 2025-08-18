import GroupService from './group-service.js';

export async function createGroup(req, res) {
  try {
    const newGroup = await GroupService.createGroup(req.body);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('GroupController.createGroup Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export async function getGroupList(req, res) {
  try {
    const { offset, limit, order, search } = req.query;
    const groups = await GroupService.getGroupList(
      Number.isNaN(Number(offset)) ? 0 : Number(offset),
      Number.isNaN(Number(limit)) ? 3 : Number(limit),
      order,
      search
    );
    res.status(200).json(groups);
  } catch (error) {
    console.error('GroupController.getGroupList Error:', error);
    res.status(404).json({ message: '그룹 목록 조회에 실패했습니다.' });
  }
}

export async function getGroupById(req, res) {
  try {
    const groupId = parseInt(req.params.groupId);
    const group = await GroupService.getGroupById(groupId);
    res.status(200).json(group);
  } catch (error) {
    console.error('GroupController.getGroupById Error:', error);
    res.status(404).json({ message: '해당 그룹을 찾을 수 없습니다.' });
  }
}

export async function updateGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const updatedGroup = await GroupService.updateGroup(groupId, req.body);
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('GroupController.updateGroup Error:', error);
    res.status(500).json({ message: '그룹 수정에 실패했습니다.' });
  }
}

export async function deleteGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const result = await GroupService.deleteGroup(groupId);
    res.status(200).json(result);
  } catch (error) {
    console.error('GroupController.deleteGroup Error:', error);
    res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
  }
}

export async function likeGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const updated = await GroupService.likeGroup(groupId);
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.likeGroup Error:', error);
    res.status(500).json({ message: '추천에 실패했습니다.' });
  }
}

export async function unlikeGroup(req, res) {
  const groupId = parseInt(req.params.groupId);
  try {
    const updated = await GroupService.unlikeGroup(groupId);
    res.status(200).json(updated);
  } catch (error) {
    console.error('GroupController.unlikeGroup Error:', error);
    res.status(500).json({ message: '추천 취소에 실패했습니다.' });
  }
}
