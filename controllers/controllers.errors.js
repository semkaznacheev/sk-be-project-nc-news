
const handle404 = (req, res, next) => {
    res.status(404).send({ msg: "path not found"})
}

const handle500 = (err, req, res, next) => {
    res.status(500).send({msg: "server error"})
}

const handle400 = (err, req, res, next) => {
    if (err.code === "22P02") {
    res.status(400).send({msg: "bad request"})
    } else {
        next(err);
    }
}

const customErrorHandler = (err, req, res, next) => {
    if (err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
}


module.exports = {handle404, handle500, handle400, customErrorHandler}