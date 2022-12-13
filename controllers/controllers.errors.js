
const handlerError404 = (req, res, next) => {
    res.status(404).send({ msg: "path not found"})
}

const handlerError500 = (err, req, res, next) => {
    res.status(500).send({msg: "server error"})
}

const handlerError400 = (err, req, res, next) => {
    if (err.code === "22P02") {
    res.status(400).send({msg: "bad request"})
    }
}



module.exports = {handlerError404, handlerError500, handlerError400}