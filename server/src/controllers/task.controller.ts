import { Request, Response } from 'express';

import { AuthRequest } from '../types';
import { createTask } from '../database/drivers/task.driver';
import { ITask } from '../models/task';

const createTaskController = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { _id } = (req as AuthRequest).user
    const task = await createTask({ title, description, status: 'pending', userId: _id } as ITask)
    res.status(200).json({ task });
};

export { createTaskController };
