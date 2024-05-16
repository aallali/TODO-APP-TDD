import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { findTaskByID } from '../src/database/drivers/task.driver';

const CONSTANTS = {
    API_PREFIX: '/api/v1',
    DB_URL: process.env.MONGO_URL_TEST as string
}

let token = '' as string;


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

})

// close & drop db after all tests are done
afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close();
});


describe(`DELETE ${CONSTANTS.API_PREFIX}/task/:id`, () => {
    it('should delete a task by ID', async () => {
        const freshTask = {
            title: 'Task to be deleted.',
            description: 'Task Description',
        }

        // create task
        const task = (await request(app)
            .post(`${CONSTANTS.API_PREFIX}/task`)
            .set('Authorization', `Bearer ${token}`)
            .send(freshTask)).body.task;

        // send delete request
        const deleteResponse = await request(app)
            .delete(`${CONSTANTS.API_PREFIX}/task/${task._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(200);
        
        // verify if task is deleted from the database
        const deletedTaskInDb = await findTaskByID(task._id);
        expect(deletedTaskInDb).toBeNull();
    });

    it('should return 404 if task does not exist', async () => {
        // send delete request with non-existing task ID
        const url = `${CONSTANTS.API_PREFIX}/task/${new mongoose.Types.ObjectId().toHexString()}`
        const deleteResponse = await request(app)
            .delete(url)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteResponse.status).toBe(404);
    });

    it('should return 400 if invalid task ID format', async () => {
        // send delete request with invalid task ID format
        const deleteResponse = await request(app)
            .delete(`${CONSTANTS.API_PREFIX}/task/invalidTaskId`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.status).toBe(400);
    });
});

