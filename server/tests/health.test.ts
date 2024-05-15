
import request from 'supertest';
import app from '../src/index';


describe('GET /health', () => {
    it('should return status OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.message).toBe('Nadi Kanadi');
    });
});
