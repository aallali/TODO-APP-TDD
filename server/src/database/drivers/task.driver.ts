
import Task, { ITask } from "../../models/task";

export async function createTask(task: ITask) {
    const { title, description, status, userId } = task;
    const freshTask = new Task({ title, description, status, userId });
    return await freshTask.save();
}

export async function findTaskByID(id: string) {
    return await Task.findById(id);
}

export async function updateTask({ id, userId }: { id: String, userId: string }, task: Partial<ITask>) {
    return await Task.updateOne({ _id: id, userId }, task)
}

export async function deleteTask(id: string, userId: string) {
    return await Task.deleteOne({ _id: id, userId })
}

export async function getAllTasks(userId: string) {
    return await Task.find({ userId }).select("-userId -__v")
}