const express = require('express')
const requireDir = require('require-dir')
const cors = require('cors')
const bodyParser = require('body-parser')
const { errors } = require('celebrate')
//iniciando o app
const app = express();
app.use(cors())

//chamando conexão
require('./src/config/connectDB')

//Permitir JSON via POST

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Requerindo todas as models
requireDir('./src/app/models')

//Pegando rotas
app.use('/', require('./src/routes'))

//Erros da validação
app.use(errors())

//Validar token do usuário
app.use('/validate', require('./src/app/controllers/authMiddleware'))


app.listen(3001, () => {
    console.log('Servidor Rodando na porta 3001')
})
