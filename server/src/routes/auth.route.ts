import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controller';
import * as Middlewares from '../middleware';
import { userValidatorSchema } from '../validators/user.validator';

const router = Router();

router.post('/signin', Middlewares.ValidateReq(userValidatorSchema), signIn);
router.post('/signup', Middlewares.ValidateReq(userValidatorSchema), signUp);

export default router;
