import GroupService from './group.service.js';

class GroupController {
  async createGroup(req, res) {
    try {
      const newGroup = await GroupService.createGroup(req.body);
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('GroupController.createGroup Error:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }

  async updateGroup(req, res) {
    const groupId = parseInt(req.params.groupId);
    try {
      const updatedGroup = await GroupService.updateGroup(groupId, req.body);
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error('GroupController.updateGroup Error:', error);
      res.status(500).json({ message: '그룹 수정에 실패했습니다.' });
    }
  }

  async deleteGroup(req, res) {
    const groupId = parseInt(req.params.groupId);
    try {
      const result = await GroupService.deleteGroup(groupId);
      res.status(200).json(result);
    } catch (error) {
      console.error('GroupController.deleteGroup Error:', error);
      res.status(500).json({ message: '그룹 삭제에 실패했습니다.' });
    }
  }
}

export default new GroupController();
