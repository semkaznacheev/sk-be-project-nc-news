const handlerError404 = (req, res, next) => {
    res.status(404).send({ msg: "path not found"})
}

const handlerError500 = (err, req, res, next) => {
    res.status(500).send({msg: "server error"})
}




module.exports = {handlerError404, handlerError500}