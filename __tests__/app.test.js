const app = require("../app.js");
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require("../db/seeds/seed.js");
const { topicData, userData, articleData, commentData } = require('../db/data/test-data/index.js')

afterAll(() => db.end());
beforeEach(() => seed({ topicData, userData, articleData, commentData }))


describe(' GET /apz - non-existant', () => {
    test('404 - non-existant routes', () => {
        return request(app)
        .get('/apz')
        .expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe("path not found");
        })
    })
})

describe('GET api/topics', () => {
    test('200 - responds with array of topics objects with following properties: slug, description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics}}) => {
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    })
})