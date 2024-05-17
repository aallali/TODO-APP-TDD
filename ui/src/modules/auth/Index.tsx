import React, { useState } from 'react';
import LockLogo from "./assets/lock.png"
import { useAuthStore } from './auth.store';
import { validatepassword, validateUsername } from './auth.validator';
import { loginAPI, registerAPI, whoAmI } from './auth.api';


export default function AuthForm() {

    const { setUser, setToken } = useAuthStore();
    const [username, updateUsername] = useState('');
    const [password, updatePassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password && validateUsername(username) && validatepassword(password))
        if (isLogin) {
                loginAPI(username, password).then(res => {
                    if (res.success) {
                        setToken(res.token)
                        whoAmI().then(res => {
                            setUser(res.user.username, res.user._id)
                        })
                    } else {
                        alert(res.error)
                    }
                }).catch(err => {
                    alert(err.message)
                })
        } else {
            registerAPI(username, password).then(res => {
                if (res.success) {
                    alert(res.message)
                } else {
                    alert(res.error)
                }
            }).catch(err => {
                alert(err.message)
            })
        }
    };
    return (
        <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
            <div className="text-white">
                <div className="mb-8 flex flex-col items-center">
                    <img src={LockLogo} width="150" alt="" />
                    <h1 className="mb-2 text-2xl">What's your today's tasks ?</h1>
                    <span className="text-gray-300">Enter Login Details</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-lg">
                        <input
                            className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                            type="text"
                            name="username"
                            placeholder="username"
                            data-testid="username"
                            onChange={(e) => updateUsername(e.target.value)}
                        />
                        {
                            username && !validateUsername(username) ? <p className='text-red-400 font-bold'>
                                Username must be alphanumeric<br />and 3-10 characters long</p> : null
                        }

                    </div>

                    <div className="mb-4 text-lg">
                        <input
                            className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                            type="Password"
                            name="password"
                            placeholder="*********"
                            data-testid="password"
                            onChange={(e) => updatePassword(e.target.value)}
                        />
                        {
                            password && !validatepassword(password) ? <p className='text-red-400 font-bold'>
                                Password must be alphanumeric<br />and 3-10 characters long</p> : null
                        }
                    </div>
                    <div className="mt-8 flex justify-center text-lg text-black">
                        <button type="submit" className="rounded-3xl bg-yellow-400 bg-opacity-50 px-10 py-2 text-black shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:backdrop-blur-md" 
                        disabled={!(validateUsername(username) && validatepassword(password))}
                        data-testid="submitBTN">
                            {
                                isLogin ? "Login" : "Register"

                            }</button>
                    </div>
                    <div className='text-center mt-4'>
                        <a href="#/" className='text-blue-300' onClick={() => setIsLogin(prev => !prev)}>
                            {
                                isLogin ? "You don't have an account? register now" : "go login instead?"
                            }
                        </a>
                    </div>

                </form>
            </div>
        </div>
    )
}
