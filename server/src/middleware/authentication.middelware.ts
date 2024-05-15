import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { AuthRequest } from '../types';



const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];


    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: '9frtiha!' });
        }

        (req as AuthRequest).user = { username: user.username, _id: user._id } as IUser;
        next();
    } catch (error) {
        res.status(401).json({ error: "TOKEN_INVALID", message: 'Not authorized, token failed, ma3ndi mandir lik' });
    }
};

export default isAuthorized;
