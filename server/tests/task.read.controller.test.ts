import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { IUser } from '../src/models/user';
import Task, { ITask } from '../src/models/task';

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


describe(`GET ${CONSTANTS.API_PREFIX}/task`, () => {
    // Existing test case
    it('should return all tasks created by the user', async () => {
        // send request to get all tasks
        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        // verify response body structure or any specific expectation about the response data
        expect(Array.isArray(response.body.tasks)).toBe(true);
        // make sure we dont get tasks not created by us
        expect(response.body.tasks.find((t: ITask) => t.userId !== user._id)).toBe(undefined)
    });

    // test case: Unauthorized Access
    it('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/task`);

        expect(response.status).toBe(401);
    });

    // test case: Empty Tasks
    it('should return an empty array if no tasks found', async () => {
        // delete all tasks related to the user
        await Task.deleteMany({ userId: user._id })

        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.tasks)).toBe(true);
        expect(response.body.tasks.length).toBe(0);
    });
});

