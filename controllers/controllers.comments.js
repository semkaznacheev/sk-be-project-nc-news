
const { checkIfArticleExist } = require('../models/models.articles.js');
const { selectCommentsById, addNewComment, removeComment } = require('../models/models.comments.js')

const getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([
        checkIfArticleExist(article_id),
        selectCommentsById(article_id)
    ])
    .then(([doesArticleExist, comments]) => {
            res.status(200).send({comments});
     }) 
     .catch((err) => {
        next(err);
   })
}

const postNewComment = (req, res, next) => {
    addNewComment(req).then((comment) => {
      res.status(201).send({comment})
    })
    .catch((err) => {
        next(err);
})
    
}

const deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send('no content')
    })
    .catch((err) => {
        next(err)
    })
}




module.exports = { getCommentsById, postNewComment, deleteComment }


