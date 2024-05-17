import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/auth.store"
import { createTask, deleteTask, fetchAllTasks, updateTask as updateTaskApi } from "./task.api";
import { validateTaskTitle } from "./task.validator";
export interface ITask {
    id: string;
    title: string;
    description?: string;
    status: "done" | "pending";
}

function TaskItem({ data, onChange, onDelete }: {
    data: ITask,
    onChange: (data: ITask) => void,
    onDelete: (id: string) => void
}) {

    const [isUpdate, toggleUpdate] = useState(false)
    const [task, updateTask] = useState(data)
    const oppositeStatus: {
        done: "pending";
        pending: "done";
    } = {
        done: "pending",
        pending: "done"
    }

    function submitUpdateHandler() {
        onChange(task)
    }

    useEffect(() => {
        onChange(task)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task.status])
    return (
        <>
            <div id="task" className="flex justify-between items-center border-b border-slate-200 py-3 px-2  transition ease-linear duration-150 hover:border-l-4 hover:border-l-indigo-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-transparent   hover:transition hover:ease-linear hover:duration-150" >
                <div className="inline-flex items-center space-x-2 grow">
                    <div onClick={() => updateTask(prev => ({ ...prev, status: oppositeStatus[prev.status] }))}>
                        {
                            task.status === "done" ?
                                (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-500 hover:text-indigo-600 hover:cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                        }
                    </div>
                    <div className={(task.status === "done" ? "text-slate-500 line-through" : "") + " cursor-none select-none text-xl w-full"} >{task.title}</div>
                </div>
                <div onClick={() => toggleUpdate((prev) => !prev)}>
                    <svg className="h-8 w-8 text-slate-500" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                </div>
                <div onClick={() => onDelete(task.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 hover:shadow-lg rounded-md shadow-gray-300   text-slate-500 hover:text-slate-700 hover:cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
            </div>
            {
                isUpdate ? (
                    <div className="flex justify-between items-center border-b border-slate-200   hover:from-indigo-200 transition ease-linear duration-150">
                        <div className="flex-row justify-between items-center border-b border-slate-200 py-3 px-2 w-[100%]">
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full h-10 border border-gray-400 p-4 rounded-md "
                                    placeholder="title here..."
                                    defaultValue={task.title}
                                    onChange={(e) => updateTask((prev) => ({ ...prev, title: e.target.value }))}
                                />
                                {
                                    task.title && !validateTaskTitle(task.title) && <p className="text-red-500 text-lg">Should be Alpha-Numeric length: 3-50</p>
                                }
                            </div>
                            <div className="my-2">
                                <textarea
                                    name="description"
                                    className="w-full border border-gray-400 p-4 rounded-md"
                                    defaultValue={task.description}
                                    onChange={(e) => updateTask((prev) => ({ ...prev, description: e.target.value }))}
                                ></textarea>
                                {
                                    task.description && !validateTaskTitle(task.description) && <p className="text-red-500 text-lg">Should be Alpha-Numeric length: 3-100</p>
                                }
                            </div>
                            <div>
                                <button className="p-1 px-4 text-white font-bold rounded-md bg-blue-500 disabled:bg-blue-200 disabled:cursor-not-allowed"
                                    disabled={
                                        !validateTaskTitle(task.title) || !validateTaskTitle(task.description || '')
                                    }
                                    onClick={submitUpdateHandler}>Save</button>

                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>
    )
}


export default function Tasks() {
    const { logout } = useAuthStore();
    const [allTasks, setAllTasks] = useState<ITask[]>([]);
    const [tasks, updateTasks] = useState<ITask[]>([]);
    const [freshTask, setFreshTask] = useState<ITask>({
        title: '',
        description: ''
    } as ITask)

    function fetchAllTasksHandler() {
        fetchAllTasks().then(res => {
            if (res.success) {
                setAllTasks(res.data.tasks.map((l: ITask & { _id: string }) => ({ ...l, id: l._id })))

            } else {
                alert("Something Went Wrong")
            }
        })
    }
    useEffect(() => {
        fetchAllTasksHandler()
    }, [])

    function handleSubmitFreshTask() {
        createTask(freshTask.title, freshTask.description as string).then(res => {
            if (res.success) {
                setAllTasks(prev => [{ ...res.task, id: res.task._id }, ...prev])
            } else {
                alert("Something Went Wrong")
            }
        })
    }

    function handleDeleteTask(id: string) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure ?")) {
            setAllTasks(prev => prev.filter(l => l.id !== id))
            deleteTask(id).then(res => {
                if (res.success) {
                    alert(res.data.message)
                } else {
                    alert("Something Went Wrong")
                }
            })
        }

    }
    function handleUpdateTask(data: ITask) {
        updateTaskApi(data).then(res => {
            if (res.success) {
                fetchAllTasksHandler()
            } else {
                alert("Something Went Wrong")
            }
     
        })
    }
    useEffect(() => {
        updateTasks(allTasks)
    }, [allTasks])
    return (

        <div className=" md:w-1/2 md:h-[95%] w-full h-screen mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300 ">
            <div className="flex flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium">Tasks list</h1>
                </div>
                <div className="inline-flex space-x-2 items-center">
                    <button
                        className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
                        onClick={() => updateTasks(allTasks.filter(l => l.status === "pending"))}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium hidden md:block">Pending</span>
                    </button>
                    <button
                        className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center hover:bg-slate-200"
                        onClick={() => updateTasks(allTasks.filter(l => l.status === "done"))}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-500 hover:text-indigo-600 hover:cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm hidden md:block">Done</span>
                    </button>
                    <button
                        className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center hover:bg-slate-200"
                        onClick={() => updateTasks(allTasks)}>
                        <span className="text-sm hidden md:block">+ Reset</span>
                    </button>
                </div>
            </div>
            <p className="text-slate-500">Hello, here are your latest tasks</p>

            <div id="tasks" className="my-5 overflow-y-auto h-[75%] ">
                <div className="flex justify-between items-center border-b border-slate-200 hover:from-indigo-200 transition ease-linear duration-150">
                    <div className="flex-row justify-between items-center border-b border-slate-200 py-3 px-2 w-[100%]">
                        <div>
                            <input
                                type="text"
                                name="title"
                                className="w-full h-10 border border-gray-400 p-4 rounded-md "
                                placeholder="Your new task title here..."
                                onChange={(e) => setFreshTask((prev) => ({ ...prev, title: e.target.value }))}
                            />
                            {
                                freshTask.title && !validateTaskTitle(freshTask.title) && <p className="text-red-500 text-lg">Should be Alpha-Numeric length: 3-50</p>
                            }

                        </div>
                        <div className="mt-2">
                            <textarea
                                name="description"
                                className="w-full border border-gray-400 p-4 rounded-md"
                                placeholder="Description here..."
                                onChange={(e) => setFreshTask((prev) => ({ ...prev, description: e.target.value }))}
                            ></textarea>
                        </div>
                        {
                            freshTask.description && !validateTaskTitle(freshTask.description) && <p className="text-red-500 text-lg">Should be Alpha-Numeric length: 3-100</p>
                        }

                        <div>
                            <button className="p-1 rounded-md bg-blue-500 disabled:bg-blue-200 flex items-center gap-2 text-lg text-white disabled:cursor-not-allowed"
                                onClick={handleSubmitFreshTask} disabled={
                                    !validateTaskTitle(freshTask.title) || !validateTaskTitle(freshTask.description || '')
                                }>
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>Add Task</button>
                        </div>
                    </div>
                </div>
                {
                    tasks.map(t => <TaskItem data={t} key={t.id} onChange={handleUpdateTask} onDelete={handleDeleteTask} />)
                }
            </div>
            {/* <p className="text-xs text-slate-500 text-center">Last updated 12 minutes ago</p> */}
            <b className="float-right p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center bg-red-600 hover:bg-red-300" onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium hidden md:block">Logout</span>
            </b>
        </div>


    )
}