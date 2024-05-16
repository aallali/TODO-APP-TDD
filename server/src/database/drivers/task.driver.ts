
import Task, { ITask } from "../../models/task";

export async function createTask(task: ITask) {
    const { title, description, status, userId } = task;
    const freshTask = new Task({ title, description, status, userId });
    return await freshTask.save();
}
