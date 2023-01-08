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
     test('200 - returns articles with sorted_by=any valid column ', () => {
       return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body: { articles }}) => {
            expect(articles).toBeSortedBy('author', {
                descending: true
            });
        })
     })
     test('400 - when provided invalid sort_by keyword', () => {
        return request(app)
         .get('/api/articles?sort_by=bananas')
         .expect(400)
         .then(({ body: { msg }}) => {
             expect(msg).toBe('bad request');
         })
      })
      test('200 - returns articles with order_by=DESC as default ', () => {
        return request(app)
         .get('/api/articles')
         .expect(200)
         .then(({ body: { articles }}) => {
             expect(articles).toBeSortedBy('created_at', {
                 descending: true
             });
         })
      })

      test('200 - returns articles with order_by=DESC/ASC', () => {
        return request(app)
         .get('/api/articles?order=asc')
         .expect(200)
         .then(({ body: { articles }}) => {
             expect(articles).toBeSortedBy('created_at', {
                 descending: false
             });
         })
      })

      test('400 - when provided invalid order keyword', () => {
        return request(app)
         .get('/api/articles?order=123dsa')
         .expect(400)
         .then(({ body: { msg }}) => {
             expect(msg).toBe('bad request');
         })
      })

      test('200 - returns articles with topic=any valid topic', () => {
        return request(app)
         .get('/api/articles?topic=cats')
         .expect(200)
         .then(({ body: { articles }}) => {
            articles.forEach((article) => {
                expect(article).toEqual(expect.objectContaining(
                    {
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "cats",
                    author: expect.any(String),
                    comment_count: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                  })
                )
                
             })
         })
      })
      test('200 - accept multiple queries', () => {
        return request(app)
         .get('/api/articles?topic=mitch&sort_by=author&order=asc')
         .expect(200)
         .then(({ body: { articles }}) => {
            expect(articles).toBeSortedBy('author', {
                descending: false
            })
            articles.forEach((article) => {
                expect(article).toEqual(expect.objectContaining(
                    {
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "mitch",
                    author: expect.any(String),
                    comment_count: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                  })
                )
                
             })
         })
      })
      test('404 - when provided non-existant topic keyword', () => {
        return request(app)
         .get('/api/articles?topic=dog')
         .expect(404)
         .then(({ body: { msg }}) => {
             expect(msg).toBe('not found');
         })
      })
      

})
describe('GET /api/articles/:article_id', () => {
    test('200: response with an article object by provided articel id with properties: author, title, article_id, body, topic, created_at, votes, comment_count', () => {
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
                comment_count: expect.any(String)
                
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
                    comment_count: "11"
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
describe('POST /api/articles/:article_id/comments', () => {
    test('201: Responds with posted comment when added new comment ', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            "username":  "butter_bridge",
            "body": "This article is awesome!"
        })
        .expect(201)
        .then(({body}) => {
          expect(body).toEqual(expect.objectContaining({
            comment:
            {
                comment_id: expect.any(Number),
                body: "This article is awesome!",
                votes: 0,
                author: "butter_bridge",
                article_id: 1,
                created_at: expect.any(String),  
          }
        }
          ))
          
        })
    })
    test('400: bad request when provided invalid article_id', () => {
        return request(app)
        .post('/api/articles/banana/comments')
        .send({
            "username":  "butter_bridge",
            "body": "This article is awesome!"
        })
        .expect(400)
    })
    test('400: bad request when there is no body provided', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            "username":  "butter_bridge"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request")
    })
    })
    test('400: bad request when there is no username', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            "body": "This article is awesome!"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request")
    })
    })
    test('404: valid but non-existant article_id ', () => {
        return request(app)
        .post('/api/articles/1000/comments')
        .send({
            "body": "This article is awesome!",
            "username":  "butter_bridge"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("not found")
    })
    })
    test('404: non-existant username ', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            "body": "This article is awesome!",
            "username":  "non_existant_user"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("not found")
    })
    })
})
describe('PATCH /api/articles/:article_id', () => {
    test('200: Responds with an article object with updated votes', () => {
        return request(app)
        .patch('/api/articles/1/')
        .send({ inc_votes : - 50 })
        .expect(200)
        .then(({body}) => {
          expect(body).toEqual(expect.objectContaining(
            { article:
                {   
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 50,
                  }
            }
          )
          )
          
        })
        
    })
    test('400: when provided an invalid article_id', () => {
        return request(app)
        .patch('/api/articles/banana/')
        .send({ inc_votes : - 50 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request")
        })
        
    })
    test('404: valid but non-existant article_id ', () => {
        return request(app)
        .patch('/api/articles/10000')
        .send({ inc_votes : - 50 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("not found")
    })
})
    test('400: bad request when there is no inc_votes property provided', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request")
    })
})
    test('400: bad request when invalid inc_votes value provided', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : "three" })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request")
    })
    })
})
describe('GET api/users', () => {
    test('200 - responds with array of users objects with following properties: username, name, avatar_url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body: {users}}) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
        })
    })
})

describe('DELETE api/comments/comment_id', () => {
    test('204 - responds with no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('400 - invalid comment_id', () => {
        return request(app)
        .delete('/api/comments/qwrwqr')
        .expect(400)
        .then((response) => {
        expect(response.body.msg).toBe("bad request")
    })
})
    test('404 - valid but not-existant comment_id', () => {
        return request(app)
        .delete('/api/comments/121232')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe("not found")

        })
   })
})
describe('GET api', () => {
    test('200', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            console.log(response)
        })
    })
})