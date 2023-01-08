
const getApi = (req, res, next) => {
    res.status(200).send("../endpoints.json")
}


module.exports = { getApi}