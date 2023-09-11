const Router = require('express')
const { verifyToken } = require('../Middleware/verifyToken')
const { followPerson, unfollowPerson, getPersonsToFollow, getPersonsYouAreFollowing, yourFollowers } = require('../Controllers/followController')

const followRouter = Router()

followRouter.post('/follow/:followerId/:followingId',verifyToken, followPerson)
followRouter.delete('/unfollow/:followerId/:followingId',verifyToken, unfollowPerson)
followRouter.get('/personstofollow/:currentUserId', verifyToken, getPersonsToFollow)
followRouter.get('/personsyouarefollowing/:userId', verifyToken, getPersonsYouAreFollowing)
followRouter.get('/yourfollowers/:followerId', verifyToken, yourFollowers)


module.exports = {
    followRouter
}