const { getApiData } = require('../models/models.allData.js');

const getApi = (req, res, next) => {
    getApiData().then((endpoints) => {
        res.status(200).send({endpoints})
    })
}


module.exports = { getApi}