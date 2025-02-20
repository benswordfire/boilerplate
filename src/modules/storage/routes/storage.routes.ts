import { Router } from 'express';
import multer from 'multer';
import { deleteFile, download, list, upload } from '../controllers/storage.controller';
import { authorize } from '../../authentication/middlewares/auth.middleware';

const multerUpload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/api/v1/upload', authorize, multerUpload.single('file'), upload);
router.get('/api/v1/files', authorize, list)
router.post('/api/v1/delete/:id', authorize, deleteFile)
router.get('/api/v1/download/:id', download)

export default router;