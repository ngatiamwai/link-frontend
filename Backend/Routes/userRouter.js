const { Router } =  require('express')
const { registerUser, userLogin } = require('../Controllers/authControllers')
const { updateUser, oneUser } = require('../Controllers/userController')
const { verifyToken } = require('../Middleware/verifyToken')
const usersRouter = Router()

usersRouter.post('/register', registerUser)
usersRouter.post('/login', userLogin)
usersRouter.post('/oneUser/:id', oneUser)
usersRouter.put('/update/:id', verifyToken, updateUser)

module.exports = {
    usersRouter
}
