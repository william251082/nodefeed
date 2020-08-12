import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[];
        }
    }
}

let mongo: any;
beforeAll(async () => {
    // not an ideal solution yet
    process.env.JWT_KEY = 'gfgsdfgsfd';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    // Build a jsonwebtoken payload. {id, email}
    const payload = {
        id,
        email: 'test@test.com'
    };
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into json
    const sessionJSON = JSON.stringify(session);

    // Take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that's the cookie with the encoded data
    // supertest expectation is an array
    return [`express:sess=${base64}`];
};