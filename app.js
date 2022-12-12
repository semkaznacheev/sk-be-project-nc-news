const express = require('express');
const app = express();
const { getTopics } = require("./controllers/controllers.topics.js")
const {handlerError404, handlerError500} = require('./controllers/controllers.errors')

app.get('/api/topics', getTopics)
app.all('*', handlerError404);


app.use(handlerError500);




module.exports = app;