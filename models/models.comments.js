const db = require('../db/connection.js');

const selectCommentsById = (article_id) => {
  return db.query(`SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
  .then((results) => {
    if (results.rowCount === 0) {
        return Promise.reject({msg: "not found", status: 404 })
    }
    return results.rows;

  })
}












module.exports = { selectCommentsById }