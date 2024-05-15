import { Types } from "mongoose";
import User, { IUser } from "../../models/user";
import { Document } from 'mongoose';
import bcrypt from 'bcryptjs';


export async function findUserByUsername(username: string): Promise<(Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId;
}) | null> {
    return await User.findOne({ username });
}

export async function isUsernameExists(username: string): Promise<boolean> {
    return !!(await User.countDocuments({ username }) > 0);
}

export async function createUser(data: { username: string, password: string }) {
    const { username, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    return await newUser.save();
}

export async function loginUser(username: string, password: string) {
    const user = await User.findOne({ username });
    const isMatch = user && await user.matchPassword(password); // little bit of gymnastics

    if (!isMatch)
        return false

    return user
}
