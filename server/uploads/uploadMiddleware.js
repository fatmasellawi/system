import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const patrolUpload = upload.fields([
  { name: 'Picture', maxCount: 1 },
  { name: 'PictureAfter', maxCount: 1 },
]);
