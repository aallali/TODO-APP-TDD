
import axios from '../../utils/axios';
import { API_URLS } from './auth.config';

import defaultAxios from "axios";

export const loginAPI = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URLS.LOGIN, { username, password });
        return { success: true, token: response.data.token };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const whoAmI = async () => {
    try {
        const response = await axios.get(API_URLS.WHOAMI);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const registerAPI = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_URLS.REGISTER, { username, password });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (defaultAxios.isAxiosError(error) && error.response) {
            return { success: false, error: error.response.data.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};