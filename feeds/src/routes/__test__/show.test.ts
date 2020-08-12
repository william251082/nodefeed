import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";

it('returns a 404 if the feed is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/feeds/${id}`)
        .send()
        .expect(404);
});

it('returns the feed if the feed is found', async () => {
    const title = 'concert';
    const price = 20;
    const response =  await  request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201);
    const feedResponse = await request(app)
        .get(`/api/feeds/${response.body.id}`)
        .send()
        .expect(200);

    expect(feedResponse.body.title).toEqual(title);
    expect(feedResponse.body.price).toEqual(price);
});