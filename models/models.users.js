const db = require('../db/connection.js');

const selectUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then(({rows: users}) => {
    return users;
  })
}





module.exports = {selectUsers}