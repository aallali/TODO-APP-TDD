
import { ITask } from '.';
import axios from '../../utils/axios';

import defaultAxios from "axios";

export const API_URLS = {
    TASK: `${process.env.REACT_APP_API_URL}/api/v1/task`,
}


export const createTask = async (title: string, description: string) => {
    try {
        const response = await axios.post(API_URLS.TASK, { title, description });
        return { success: true, task: response.data.task };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};


export const fetchAllTasks = async () => {
    try {
        const response = await axios.get(API_URLS.TASK);
        return { success: true, data: response.data };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};


export const deleteTask = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URLS.TASK}/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};




export const updateTask = async (data: ITask) => {
    try {
        const response = await axios.patch(`${API_URLS.TASK}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}
