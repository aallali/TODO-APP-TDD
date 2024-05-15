import { IUser } from '../models/user';
import { Request } from "express";

export interface AuthRequest extends Request {
    user: IUser;
}
