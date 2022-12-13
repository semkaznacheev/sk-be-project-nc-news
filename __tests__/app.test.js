const app = require("../app.js");
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require("../db/seeds/seed.js");
const { topicData, userData, articleData, commentData } = require('../db/data/test-data/index.js');
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

describe('GET api/articles', () => {
    test('200 - responds with array of articles objects with following properties: author, title, article_id, topic, created_at, votes, comment_count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: {articles}}) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
                expect(article).toEqual(expect.objectContaining({

                    article_id: expect.any(Number),
                    comment_count: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    
                }))
            })
               
            expect(articles).toBeSortedBy('created_at', {
                descending: true
              });
        })
    })
})
describe('GET /api/articles/:article_id', () => {
    test('200: response with an article objects by provided articel id with properties: author, title, article_id, body, topic, created_at, votes', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body: { article }}) => {
            expect(article).toEqual(expect.objectContaining({

                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                
            }))
            expect(article.article_id).toBe(1);
        })
    })

    // test('400: bad request when provided invalid article_id', () => {
    //     return request(app)
    //     .get('/api/articles/banana')
    //     .expect(404)
        
    // })
})