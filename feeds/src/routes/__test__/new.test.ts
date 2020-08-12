import request from 'supertest';
import { app } from '../../app';
import {Feed} from "../../models/feed";

it('has a route handler that is listening to /api/feeds for post requests', async () => {
    const response = await request(app)
        .post('/api/feeds')
        .send({});

    expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
     await request(app).post('/api/feeds').send({}).expect(401);
});
it('returns a status other than 401 if user is signed in', async () => {
     const response = await request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
});
it('returns an error if an invalid title is provided', async () => {
    await  request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: -10,
        })
        .expect(400);
});
it('returns an error if an invalid price is provided', async () => {
    await  request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title: 'valid title',
        })
        .expect(400);
});
it('creates a feed with valid inputs', async () => {
    // add in a check to make sure a feed was saved

    // take a look at all the feeds inside Feed collection
    let feeds = await Feed.find({});
    expect(feeds.length).toEqual(0);

    const title = 'valid title';

    await  request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 1.00,
        })
        .expect(201);

    feeds = await Feed.find({});
    expect(feeds.length).toEqual(1);
    expect(feeds[0].title).toEqual(title);
    expect(feeds[0].price).toEqual(1.00);
});

it ('publishes an event', async() => {
    const title = 'valid title';

    await  request(app)
        .post('/api/feeds')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 1.00,
        })
        .expect(201);
});
