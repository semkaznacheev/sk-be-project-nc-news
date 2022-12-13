const express = require('express');
const app = express();
const { getTopics } = require("./controllers/controllers.topics.js")
const { getCommentsById } = require("./controllers/controllers.comments.js")
const { getArticles, getArticleById } = require("./controllers/controllers.articles.js")
const {handle404, handle500, handle400, customErrorHandler} = require('./controllers/controllers.errors')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsById)
app.all('*', handle404);



app.use(handle400);
app.use(customErrorHandler);
app.use(handle500);




module.exports = app;