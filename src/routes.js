const express = require('express')
const routes = express.Router()
const User = require('./app/controllers/User')

//Rotas CRUD em Usuários
routes.get('/users', User.index)
routes.post('/register', User.store)
routes.get('/users/:id', User.show)
routes.put('/users/:id', User.update)
routes.delete('/users/:id', User.destroy)

routes.post('/lostPassword', User.lostPassword)
routes.post('/resetPassword', User.resetPassword)

routes.post('/getMail', User.userMail)

routes.post('/getByEmail', User.getUserbyEmail)
routes.post('/getUserByToken', User.getUserByToken)
//Rota de autenticação
routes.post('/auth', User.authenticate)


module.exports = routes