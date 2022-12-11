import { Router } from 'express';
import { Container } from 'typedi';

import UserController from '../controllers/user.controller';
import { validatorLogin, validatorRegister } from '../middleware/validation/auth';

const userController = Container.get(UserController);
const router = Router();

router.post('/login', [validatorLogin], userController.login);
router.post('/register', [validatorRegister], userController.register);
// router.post('/change-password', changePassword);

export default router;
