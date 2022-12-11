import { Router } from 'express';
import { Container } from 'typedi';

import UserController from '../controllers/user.controller';
import { checkUserJwt } from '../middleware/checkJwt';


import auth from './auth';
import profile from './profile';
;
const userController = Container.get(UserController);
const router = Router();

//sub routes
router.use('/auth', auth);
router.use('/profile', checkUserJwt, profile);

router.delete('/', userController.delele)
router.get('/all', userController.all)

export default router;
