import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { IUser } from '../src/models/user';
import { findTaskByID } from '../src/database/drivers/task.driver';

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
    it('should update task\'s title by Id', async () => {
        const freshTask = {
            title: 'Task with title random.',
            description: 'Task Description',
        }

        // create task
        const task = (await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send(freshTask)).body.task;


        // get the ID from the return object
        /* task._id */

        // send update with new title
        const updatedTitle = task.title + '[updated]';
        const updateResponse = await request(app)
            .patch(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send({ id: task._id, title: updatedTitle });
        
        expect(updateResponse.status).toBe(200);
        // verify if title updated in database
        const updatedTaskInDb = await findTaskByID(task._id);
        expect(updatedTaskInDb).toBeDefined();
        expect(updatedTaskInDb?.title).toBe(updatedTitle);
        expect(updatedTaskInDb?.description).toBe(task.description);
    });

    it('should update task\'s description by Id', async () => {
        const freshTask = {
            title: 'Task with title random.',
            description: 'Task Description',
        }

        // create task
        const task = (await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send(freshTask)).body.task;


        // get the ID from the return object
        /* task._id */

        // send update with new description
        const updatedDescription = task.description + '[updated]';
        await request(app)
            .patch(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send({ id: task._id, title: task.title, description: updatedDescription });


        // verify if description updated in database
        const updatedTaskInDb = await findTaskByID(task._id);
        expect(updatedTaskInDb).toBeDefined();
        expect(updatedTaskInDb?.title).toBe(task.title);
        expect(updatedTaskInDb?.description).toBe(updatedDescription);
    });


    it('should update task\'s status by Id', async () => {
        const freshTask = {
            title: 'Task with title random.',
            description: 'Task Description',
        }

        // create task
        const task = (await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send(freshTask)).body.task;


        // get the ID from the return object
        /* task._id */

        // send update with new status
        await request(app)
            .patch(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send({ id: task._id, status: "done" });


        // verify if description updated in database
        const updatedTaskInDb = await findTaskByID(task._id);
        expect(updatedTaskInDb).toBeDefined();
        expect(updatedTaskInDb?.title).toBe(task.title);
        expect(updatedTaskInDb?.description).toBe(task.description);
        expect(updatedTaskInDb?.status).toBe("done");
    });
});
