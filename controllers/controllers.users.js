const {selectUsers} = require('../models/models.users.js')

const getUsers = (req, res, next) => {
   selectUsers()
   .then((users) => {
     res.status(200).send({users})
   })
   .catch((err) => {
    next(err)
   })
}




module.exports = {getUsers}