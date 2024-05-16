import { Router } from 'express';
import { signIn, signUp, whoAmI } from '../controllers/auth.controller';
import * as Middlewares from '../middleware';
import { userValidatorSchema } from '../validators/user.validator';
import isAuthorized from '../middleware/authentication.middelware';

const router = Router();

router.post('/signin', Middlewares.ValidateRequest(userValidatorSchema), signIn);
router.post('/signup', Middlewares.ValidateRequest(userValidatorSchema), signUp);
router.get('/whoami', isAuthorized, whoAmI);

export default router;
