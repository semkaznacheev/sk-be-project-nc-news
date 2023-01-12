const db = require('../db/connection.js');

const selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const validSortByQueries = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_id', 'comment_count'];
  const validOrderByQueries = ['asc', 'desc'];

  if (!validSortByQueries.includes(sort_by) || !validOrderByQueries.includes(order)){
     return Promise.reject({status: 400, msg: 'bad request'})
  }
  const queryValues = [];
  let queryString = `SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count, title, topic, articles.author,  articles.created_at, articles.votes
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`
  
  if(topic !== undefined) {
    queryString += ` WHERE topic = $1 `
    queryValues.push(topic);
  }
  queryString += ` GROUP BY articles.article_id `;
  queryString += ` ORDER BY ${sort_by} ${order}`;
  return db.query(queryString, queryValues).then(({rows: articles}) => {
    if (articles.length === 0) {
      return Promise.reject({msg: "not found", status: 404 })
    }
    return articles;
  })
}

const selectArticleById = (article_id) => {

  return db.query(`SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, articles.body, 
   COUNT(comments.comment_id) AS comment_count
   FROM articles 
   LEFT JOIN comments ON comments.article_id = articles.article_id
   WHERE articles.article_id = $1
   GROUP BY articles.article_id
   ;`, [article_id])
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

const updateArticleById = (inc_votes, article_id) => {
   return db.query(`
   UPDATE articles 
   SET votes = votes + $1
   WHERE article_id = $2
   RETURNING * ;`, [inc_votes, article_id])
   .then((results) => {
    if (results.rowCount === 0) {
      return Promise.reject({msg: "not found", status: 404 })
  }
  return results.rows[0];
  })
}









module.exports = { selectArticles, selectArticleById, checkIfArticleExist, updateArticleById}