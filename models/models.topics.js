const db = require('../db/connection.js');



 const selectTopics = () => {
   return db.query("SELECT * FROM topics")
    .then(({rows: topics}) => {
        return topics;
    })
    
 }








 module.exports = { selectTopics }