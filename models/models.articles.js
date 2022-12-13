const db = require('../db/connection.js');

const selectArticles = () => {
  return db.query(`SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count, title, topic, articles.author, articles.body,  articles.created_at, articles.votes
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `)
  .then(({rows: articles}) => {
    return articles;
  })
}








module.exports = { selectArticles }