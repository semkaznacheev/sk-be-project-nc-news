const db = require('../db/connection.js');

const selectArticles = () => {
  return db.query(`SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count, title, topic, articles.author,  articles.created_at, articles.votes
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `)
  .then(({rows: articles}) => {
    return articles;
  })
}

const selectArticleById = (article_id) => {

  return db.query(`SELECT * FROM articles WHERE article_id = $1 ;`, [article_id])
  .then((results) => {
    if (results.rowCount === 0) {
        return Promise.reject({msg: "not found", status: 404 })
    }
    return results.rows[0];
  })
}

const checkIfArticleExist = (article_id) => {
  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then(({rowCount}) => {
    if (rowCount === 0) {
       return Promise.reject({msg: "not found", status: 404})
    } else {
       return true;
    }
  })
}









module.exports = { selectArticles, selectArticleById, checkIfArticleExist }