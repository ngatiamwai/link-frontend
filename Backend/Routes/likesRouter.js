const Router = require('express')
const { verifyToken } = require('../Middleware/verifyToken')
const { likePost, unlikePost, getLikedPostsByUser } = require('../Controllers/likeController')

const likeRouter = Router()

likeRouter.get('/likepost/:userId/:postId', verifyToken, likePost)
likeRouter.delete('/unlikepost/:userId/:postId', verifyToken, unlikePost)
likeRouter.get('/yourlikes/:userId', verifyToken, getLikedPostsByUser)

module.exports = {
    likeRouter
}