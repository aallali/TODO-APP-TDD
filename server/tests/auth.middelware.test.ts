import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

let token = '';

const CONSTANTS = {
    API_PREFIX: '/api/v1/auth',
    DB_URL: process.env.MONGO_URL_TEST as string
}


beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URL as string);

    const creds = {
        username: 'allali',
        password: 'password',
    }
    await request(app)
        .post(`${CONSTANTS.API_PREFIX}/signup`)
        .send(creds)

    token = (await request(app)
        .post(`${CONSTANTS.API_PREFIX}/signin`)
        .send(creds)).body.token

})


afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close();
});


describe(`GET ${CONSTANTS.API_PREFIX}/whoami`, () => {
    it('should return authorized user in token', async () => {

        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/whoami`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            "message": "Allez Si allali, Allez Si Brahim",
            "status": "OK",
            "user": {
                "username": "allali"
            }
        });
        expect(response.body.user._id).toBeDefined();
    });
    it('should block access [bad token]', async () => {

        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/whoami`)
            .set('Authorization', `Bearer xxxx`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Not authorized, token failed, ma3ndi mandir lik");
    });

    it('should block access 2 [no token at all]', async () => {

        const response = await request(app)
            .get(`${CONSTANTS.API_PREFIX}/whoami`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Not authorized, no token");
    });
});
