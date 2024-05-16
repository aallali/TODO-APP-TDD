import { Router } from 'express';
import * as Middlewares from '../middleware';
import isAuthorized from '../middleware/authentication.middelware';
import { idInParamSchema, newTaskValidatorSchema, updateWithAtLeastOneFieldValidatorSchema as updateTaskSchema } from '../validators/task.validator';
import { createTaskController, deleteTaskController, getAllTasksController, updateTaskController } from '../controllers/task.controller';

const router = Router();

// Prefix: /task
router.post('/',
    isAuthorized,
    Middlewares.ValidateRequest(newTaskValidatorSchema),
    createTaskController
);

router.patch('/',
    isAuthorized,
    Middlewares.ValidateRequest(updateTaskSchema),
    updateTaskController
)


router.delete('/:id',
    isAuthorized,
    Middlewares.ValidateParams(idInParamSchema),
    deleteTaskController
)


router.get('/',
    isAuthorized,
    getAllTasksController
)


export default router;
