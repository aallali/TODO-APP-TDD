import create from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
    username: string;
    userId: string;
    token: string;
    setUser: (username: string, userId: string) => void;
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
    username: '',
    userId: '',
    token: '',
    setUser: (username, userId) => set(() => ({ username, userId })),
    setToken: (token) => set(() => ({ token })),
    logout: () => set(() => ({
        username: '',
        userId: '',
        token: '',
    }))
}),
    {
        name: 'authTodo1337',
        partialize: state => ({
            token: state.token,
            username: state.username,
            userId: state.userId
        }),
        getStorage: () => localStorage,
    })
)