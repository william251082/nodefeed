import request from 'supertest';
import {app} from "../../app";

const createFeed = () => {
    return request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title: 'rwegtdfb',
            price: 20
        });
};

it('can fetch a list of feeds', async () => {
    await createFeed();
    await createFeed();
    await createFeed();

    const response = await request(app)
        .get('/api/feeds')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});