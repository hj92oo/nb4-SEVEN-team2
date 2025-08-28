import express from 'express';
import multer from 'multer';
import path from 'path';
// cloudinary storage 추가
/*import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';*/

const router = express.Router();

// ✅ multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads/'); // 저장 경로
  },
  filename: (req, file, cb) => {
    // 파일 이름: timestamp-원본이름
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ 이미지 업로드 라우터
router.post('/', upload.array('files'), (req, res) => {
  /**     
 * #swagger.tags = ['Images']
 * #swagger.summary = '이미지 파일 업로드'
 * #swagger.consumes = ['multipart/form-data']
 * #swagger.parameters['files'] = {
      in: 'formData',
      description: '업로드할 이미지 파일 (여러 개 가능)',
      required: true,
      type: 'array',
      items: { type: 'string', format: 'binary' }
   }
 * #swagger.responses[200] = {
      description: "업로드 성공",
      content: {"application/json": {
          example: {
            urls: ["string"]
          }}}}
 * #swagger.responses[400] = {
      description: "잘못된 요청 (이미지 파일 아님)",
      content: {"application/json": {
          example: {
            message: "File should be an image file"
          }}}}
 */


  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    // 서버 주소 + 파일 경로 (절대 URL 반환)
    const host = req.protocol + '://' + req.get('host');
    const urls = files.map((file) => `${host}/uploads/${file.filename}`);

    res.json({ urls });
  } catch (error) {
    console.error('POST /images Error:', error);
    res.status(500).json({ message: '이미지 업로드 중 오류가 발생했습니다.' });
  }
});

export default router;
