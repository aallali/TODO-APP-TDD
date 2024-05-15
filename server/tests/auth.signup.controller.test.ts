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
    await mongoose.connect(process.env.MONGO_URL_TEST as string);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close();
});



describe(`POST ${CONSTANTS.API_PREFIX}/signup`, () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send({
                username: 'allali',
                password: 'password',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should not register a user with a short username', async () => {
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send({
                username: 'ab',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Username must be at between 3-10 characters long (alpha-numeric only)');
    });

    it('should not register a user with a short password', async () => {
        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send({
                username: 'allali',
                password: '12',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Password must be at between 3-10 characters long (alpha-numeric only)');
    });

    it('should not register a user if username already exists', async () => {
        await new User({ username: 'allali', password: 'password' }).save();

        const response = await request(app)
            .post(`${CONSTANTS.API_PREFIX}/signup`)
            .send({
                username: 'allali',
                password: 'password',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exists, Safi Ghyrha');
    });
});
