const express = require('express');
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/controllers.topics.js")
const { getCommentsById, postNewComment } = require("./controllers/controllers.comments.js")
const { getArticles, getArticleById, patchArticleById } = require("./controllers/controllers.articles.js")
const {handle404, handle500, handle400, customErrorHandler, handlePSQL404} = require('./controllers/controllers.errors')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsById)
app.post('/api/articles/:article_id/comments', postNewComment)
app.patch('/api/articles/:article_id', patchArticleById)
app.all('*', handle404);



app.use(handle400);
app.use(customErrorHandler);
app.use(handlePSQL404);
app.use(handle500);




module.exports = app;