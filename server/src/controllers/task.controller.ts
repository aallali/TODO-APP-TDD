import { Request, Response } from 'express';

import { AuthRequest } from '../types';
import { createTask, deleteTask, getAllTasks, updateTask } from '../database/drivers/task.driver';
import { ITask } from '../models/task';

const createTaskController = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const { _id } = (req as AuthRequest).user
        const task = await createTask({ title, description, status: 'pending', userId: _id } as ITask)
        res.status(200).json({ task });
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong [server level]', error: error.message });
    }
};

const updateTaskController = async (req: Request, res: Response) => {
    try {
        const { id, title, description, status } = req.body;
        const { _id: userId } = (req as AuthRequest).user
        await updateTask({ id, userId }, { title, description, status });
        res.status(200).json({ message: "OK" })
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong [server level]', error: error.message });
    }
}
const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;
        const { _id: userId } = (req as AuthRequest).user
        const docsDeleted = await deleteTask(taskId, userId);
        if (docsDeleted.deletedCount) {
            return res.status(200).json({ message: "Task deleted successfully" });
        } else {
            return res.status(404).json({ message: "No Task Found Matching the query." });
        }

    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong [server level]', error: error.message });
    }
};

const getAllTasksController = async (req: Request, res: Response) => {
    try {
        const { _id: userId } = (req as AuthRequest).user
        const tasks = await getAllTasks(userId);
        res.status(200).json({ tasks });
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong [server level]', error: error.message });
    }
};

export { createTaskController, updateTaskController, deleteTaskController, getAllTasksController };
