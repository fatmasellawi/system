import multer from 'multer';

const storage = multer.memoryStorage(); // ou diskStorage si vous voulez stocker localement

const upload = multer({ storage });

export const patrolUpload = upload.fields([
  { name: 'imageBefore', maxCount: 1 },
  { name: 'imageAfter', maxCount: 1 }
]);
