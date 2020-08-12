import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {Feed} from "../../models/feed";

it('returns a 404 if the provided is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/feeds/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'gvhbj',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/feeds/${id}`)
        .send({
            title: 'gvhbj',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if user does not own the feed', async () => {
    const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title: 'gvhbj',
            price: 20
        });
    // edit request
    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .send({
            title: 'sgsfdgsdf',
            price: 200
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', cookie)
        .send({
            title: 'gvhbj',
            price: 20
        });
    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 200
        })
        .expect(400);
    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'gshdjuf',
            price: -200
        })
        .expect(400);
});

it('updates the feed provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', cookie)
        .send({
            title: 'gvhbj',
            price: 20
        });
    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const feedResponse = await request(app)
        .get(`/api/feeds/${response.body.id}`)
        .send();

    expect(feedResponse.body.title).toEqual('new title');
    expect(feedResponse.body.price).toEqual(100);
});

it ('publishes an event', async() => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', cookie)
        .send({
            title: 'gvhbj',
            price: 20
        });
    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);
});

it('rejects updates if the feed is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', cookie)
        .send({
            title: 'gvhbj',
            price: 20
        });

    const feed = await Feed.findById(response.body.id);
    feed!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await feed!.save();

    await request(app)
        .put(`/api/feeds/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);
});