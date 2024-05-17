import axios from "axios";
import { useAuthStore } from "../modules/auth/auth.store";


const babyAxios = axios.create()

babyAxios.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().token;

    config.headers.Authorization = `Bearer ${accessToken || ''}`

    return config
})
babyAxios.interceptors.response.use((resp) => {
    return resp
}, error => {

    console.log(error.code)
    if (error?.response?.status === 401 || error?.response?.status === 403) {
        useAuthStore.getState().logout()
    } else if (error.code === "ERR_NETWORK") {
        alert("[Network Error] : please retry later")
    }
    return Promise.reject(error);
})

export default babyAxios
