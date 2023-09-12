const  {Router} = require('express')
const { uploadPost, allPosts, getPostsByUserId, getOnePost, deletePost } = require('../Controllers/postController')
const { verifyToken } = require('../Middleware/verifyToken')
const postRouter = Router()

postRouter.post('/upload/:userId', verifyToken, uploadPost)
postRouter.get('/allPosts', allPosts)
postRouter.get('/onepost/:postId', verifyToken, getOnePost)
postRouter.get('/yourposts/:id', verifyToken, getPostsByUserId)
postRouter.delete('/deletepost/:userId/:postId', verifyToken, deletePost)

module.exports = {
    postRouter
}