import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
    title: string
    description: string
    status: 'pending' | 'done'
    userId: Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending'
    },
    userId: { type: Types.ObjectId, ref: 'User', required: true },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
