import { v2 as cloudinary } from 'cloudinary';
import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage} from 'multer-storage-cloudinary';
import { Container } from 'typedi';

import UserController from '../controllers/user.controller';
import { pagination } from '../middleware/pagination';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const multerOpts= {
  cloudinary: cloudinary,
 
};
const storage = new CloudinaryStorage(multerOpts);
const upload = multer({ storage: storage });
const userController = Container.get(UserController);
const router = Router();

router.put('/', upload.single('image'), userController.editProfile);
router.get('/', userController.getProfile);


export default router;
