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
    test('200: response with an article object by provided articel id with properties: author, title, article_id, body, topic, created_at, votes', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body: { article }}) => {
            expect(article).toEqual(expect.objectContaining({

                article_id: expect.any(Number),
                body: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                
            }))
            expect(article).toEqual(
                {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                  }
            )
            expect(article.article_id).toBe(1);
        })
    })

    test('400: bad request when provided invalid article_id', () => {
        return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('bad request')
        })
    })
    test('404: valid but not-existant article_id', () => {
        return request(app)
        .get('/api/articles/10000')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
        })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('200: Responds with: an array of comments for the given article_id; each comment should have the properties: comment_id, votes, created_at, author, body', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body: { comments }}) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
          expect(comment).toEqual(expect.objectContaining({

                comment_id: expect.any(Number),
                body: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                
            }))
        })
        })
    })
    test('200: Comments should be served with the most recent comments first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .then(({body: { comments }}) => {
          expect(comments).toBeSortedBy('created_at', {
            descending: true,
          })
        })
    })
    test('400: bad request when provided invalid article_id', () => {
        return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('bad request')
        })
    })

    test('404: valid but not-existant article_id', () => {
        return request(app)
        .get('/api/articles/10000/comments')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg;
            expect(msg).toBe('not found')
        })
    })

    test('200: responds with empty array for an existant article_id that has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body: { comments }}) => {
            expect(comments).toHaveLength(0);
        })
    })
})