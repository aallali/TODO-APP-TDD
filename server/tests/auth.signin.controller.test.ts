// tests/controllers/authController.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import User from '../src/models/user';

const CONSTANTS = {
    API_PREFIX: '/api/v1/auth',
    DB_URL: process.env.MONGO_URL_TEST as string
}

beforeEach(async () => {
    await mongoose.connect(CONSTANTS.DB_URL as string);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close();
});


describe(`POST ${CONSTANTS.API_PREFIX}/signin`, () => {
    it('should sign in without issues', async () => {
        const creds = {
            username: 'allali',
            password: 'password',
        }

        await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send(creds);

        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signin`)
            .send(creds);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
    });
    it('should not singIn, incorrect password', async () => {
        const creds = {
            username: 'allali',
            password: 'password',
        }
        const wrongCreds = {
            username: 'allali',
            password: 'ooops',
        }
        await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send(creds);

        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signin`)
            .send(wrongCreds);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ "message": "Wrong credentials" });
    });

    it('should be invalid input 1', async () => {
        const creds = {
            username: 'a',
            password: 'a',
        }
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signin`)
            .send(creds);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            errors: [
                {
                    validation: 'regex',
                    code: 'invalid_string',
                    message: 'Username must be at between 3-10 characters long (alpha-numeric only)',
                    path: ["username"]
                },
                {
                    validation: 'regex',
                    code: 'invalid_string',
                    message: 'Password must be at between 3-10 characters long (alpha-numeric only)',
                    path: ["password"]
                }
            ]
        });
    });
    it('should be invalid input password', async () => {
        const creds = {
            username: 'allali',
            password: 'a',
        }
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signin`)
            .send(creds);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            errors: [
                {
                    validation: 'regex',
                    code: 'invalid_string',
                    message: 'Password must be at between 3-10 characters long (alpha-numeric only)',
                    path: ["password"]
                }
            ]
        });
    });
    it('should be invalid input username', async () => {
        const creds = {
            username: 'a.',
            password: 'password',
        }
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signin`)
            .send(creds);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            errors: [
                {
                    validation: 'regex',
                    code: 'invalid_string',
                    message: 'Username must be at between 3-10 characters long (alpha-numeric only)',
                    path: ["username"]
                },
            ]
        });
    });
});
