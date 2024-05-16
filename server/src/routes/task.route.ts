import { Router } from 'express';
import * as Middlewares from '../middleware';
import isAuthorized from '../middleware/authentication.middelware';
import { taskValidatorSchema } from '../validators/task.validator';
import { createTaskController } from '../controllers/task.controller';

const router = Router();

// Prefix: /task
router.post('/', isAuthorized, Middlewares.ValidateReq(taskValidatorSchema), createTaskController);

export default router;
