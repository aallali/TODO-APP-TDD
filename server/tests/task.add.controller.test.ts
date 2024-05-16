import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { IUser } from '../src/models/user';


const CONSTANTS = {
    API_PREFIX: '/api/v1',
    DB_URL: process.env.MONGO_URL_TEST as string
}


let token = '' as string;
let user = {} as IUser;

beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URL as string);

    const creds = {
        username: 'allali',
        password: 'password',
    }
    await request(app)
        .post(`${CONSTANTS.API_PREFIX}/auth/signup`)
        .send(creds)

    token = (await request(app)
        .post(`${CONSTANTS.API_PREFIX}/auth/signin`)
        .send(creds)).body.token

    user = (await request(app)
        .get(`${CONSTANTS.API_PREFIX}/auth/whoami`)
        .set('Authorization', `Bearer ${token}`)).body.user
})

// close & drop db after all tests are done
afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close();
});


describe(`POST ${CONSTANTS.API_PREFIX}/task`, () => {
    it('should create a new task', async () => {
        const freshTask = {
            title: 'Create ADD:TASK service',
            description: 'Task Description',
        }
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send(freshTask);

        expect(response.status).toBe(200);
        expect(response.body.task.title).toBe(freshTask.title);
        expect(response.body.task.description).toBe(freshTask.description);
        expect(response.body.task.status).toBe('pending');
        expect(response.body.task.userId).toBe(user._id.toString());
    });

    it('should not create a task without a title', async () => {
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Task Description',
                status: 'pending',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toMatchObject([{
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['title'],
            message: 'Required'
        }]);
    });
    it('should create a task without a description', async () => {
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Task with no description is OK'
            });


        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            "task": {
                "status": "pending",
                "title": "Task with no description is OK",
                "userId": user._id
            }
        });
    });
});
