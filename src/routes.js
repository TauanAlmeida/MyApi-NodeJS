const express = require('express')
const routes = express.Router()
const User = require('./app/controllers/User')
const { 
    validateUsers, 
    validateAuth, 
    validateLostPassword, 
    validateResetPassword
} = require('./app/validators/validators')

//Rotas para Usuários
routes.get('/users', User.index)
routes.post('/register', validateUsers, User.store)
routes.get('/users/:id', User.show)
routes.put('/users/:id', User.update)
routes.delete('/users/:id', User.destroy)

routes.post('/lostPassword', validateLostPassword, User.lostPassword)
routes.post('/resetPassword', validateResetPassword, User.resetPassword)

routes.post('/getMail', User.userHasMail)

routes.post('/getUserByEmail', User.getUserbyEmail)
routes.post('/getUserByToken', User.getUserByToken)

//Rota de autenticação
routes.post('/auth', validateAuth, User.authenticate)


module.exports = routes