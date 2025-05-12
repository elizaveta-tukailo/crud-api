import request from "supertest";
import { server } from "../server";

const API_URL = '/api/users';

const newUser = {
    username: 'Mike',
    age: 18,
    hobbies: ['fishing']
}

describe("Testing User API", () => {
    let newUserId: string;

    beforeAll(() => {
        jest.mock('uuid', () => ({
          v4: jest.fn(() => 'mocked-uuid')
        }));
    });
    
    afterAll(() => {
        server.close();
        jest.restoreAllMocks();
    });


    test("GET /api/users - get all users - should return empty array", async () => {
        const response = await request(server).get(API_URL);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("POST api/users - a new user is created - should return newly created user ", async () => {
        const response = await request(server).post(API_URL).send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newUser);
        expect(response.body.id).toBeDefined();

        newUserId = response.body.id;
    });

    test("GET api/users/{userId} - get created user - should return created user ", async () => {
        const response = await request(server).get(API_URL+"/"+newUserId);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(newUserId);
        expect(response.body).toMatchObject(newUser);
    });

    test("PUT /api/users/{userId} - update user - should return updated user", async () => {
        const updatedUser = {
            username: 'Liz',
            age: 24,
            hobbies: ['painting']
        }
        const response = await request(server).put(API_URL+"/"+newUserId).send(updatedUser);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(newUserId);
        expect(response.body).toMatchObject(updatedUser);
    });

    test("DELETE /api/users/{userId} - delete user", async () => {
        const response = await request(server).delete(API_URL+"/"+newUserId);

        expect(response.status).toBe(204);
    });

    test("GET /api/users/{userId} - get deleted user", async () => {
        const response = await request(server).delete(API_URL+"/"+newUserId);

        expect(response.status).toBe(404);
    });
});