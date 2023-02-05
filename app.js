const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const { getTopics } = require("./controllers/controllers.topics.js")
const { getUsers } = require("./controllers/controllers.users.js")
const { getCommentsById, postNewComment, deleteComment } = require("./controllers/controllers.comments.js")
const { getArticles, getArticleById, patchArticleById } = require("./controllers/controllers.articles.js")
const {getApi} = require("./controllers/controllers.allData")
const {handle404, handle500, handle400, customErrorHandler, handlePSQL404} = require('./controllers/controllers.errors')

app.get('/api', getApi)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsById)
app.get('/api/users', getUsers)
app.post('/api/articles/:article_id/comments', postNewComment)
app.patch('/api/articles/:article_id', patchArticleById)
app.delete('/api/comments/:comment_id', deleteComment)
app.all('*', handle404);



app.use(handle400);
app.use(customErrorHandler);
app.use(handlePSQL404);
app.use(handle500);




module.exports = app;