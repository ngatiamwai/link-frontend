const { Router } = require('express')
const { verifyToken } = require('../Middleware/verifyToken')
const { createComment, allCommentsByPostId, allCommentsByuserId, deleteComment, subComment, updateComment } = require('../Controllers/commentsController')
const commentsRouter = Router()

commentsRouter.post('/comment/:userId/:postId', verifyToken, createComment)
commentsRouter.get('/postscomments/:postId/', allCommentsByPostId)
commentsRouter.get('/yourcomments/:userId', verifyToken, allCommentsByuserId)
commentsRouter.delete('/deletecomment/:userId/:postId/:commentId', verifyToken, deleteComment)
commentsRouter.post('/subcomment/:userId/:commentId', verifyToken, subComment)
commentsRouter.post('/updatecomment/:commentId', verifyToken, updateComment)

module.exports = {
    commentsRouter
}