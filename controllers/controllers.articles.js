const { selectArticles, selectArticleById, updateArticleById } = require('../models/models.articles.js');

const getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;

    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}
const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const patchArticleById = (req, res, next) => {
   const { article_id} = req.params;
   const { body: {inc_votes}} = req;
    updateArticleById(inc_votes, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}




module.exports = { getArticles, getArticleById, patchArticleById }