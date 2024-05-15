import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { createUser, isUsernameExists, loginUser } from '../database/drivers/user.driver';

const signUp = async (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string, password: string };
    try {
        const existingUser = await isUsernameExists(username);
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists, Safi Ghyrha' });
        }

        await createUser({ username, password });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong [server level]', error });
    }
};

const signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string, password: string };

    try {
        const isValidUser = await loginUser(username, password);

        if (!isValidUser) {
            return res.status(400).json({ message: 'Wrong credentials' });
        }

        const token = jwt.sign(
            { userId: isValidUser._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong [server level]' });
    }
};

export { signUp, signIn };
