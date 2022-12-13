const express = require('express');
const app = express();
const { getTopics } = require("./controllers/controllers.topics.js")
const { getArticles, getArticleById } = require("./controllers/controllers.articles.js")
const {handlerError404, handlerError500, handlerError400, customErrorHandler} = require('./controllers/controllers.errors')

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.all('*', handlerError404);



app.use(handlerError400);
app.use(customErrorHandler);
app.use(handlerError500);




module.exports = app;