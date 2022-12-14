const db = require('../db/connection.js');

const selectCommentsById = (article_id) => {
  return db.query(`SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
  .then(({rows}) => {
    return rows;
  })
}

const addNewComment = (req) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    return db.query(`INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, article_id])
    .then((results) => {
      if (results.rowCount === 0) {
        return Promise.reject({msg: "not found", status: 404 })
    }
    return results.rows[0];
    })
}

const removeComment = (comment_id) => {

  return db.query(` DELETE FROM comments WHERE comment_id = $1 ; `, [comment_id])
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({msg: "not found", status: 404})
    }
    return {msg: 'No content'};

  })
}












module.exports = { selectCommentsById, addNewComment, removeComment}