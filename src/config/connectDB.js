const mongoose = require('mongoose')
const { DB_URL_BASE, DB_NAME } = require('../../.env')

//Iniciando o Banco de Dados
mongoose.connect(`mongodb://${DB_URL_BASE}/${DB_NAME}`, 
{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
})
.then(e => {
    console.log(`MongoDb conectado! \nURL: ${DB_URL_BASE} DB_NAME: ${DB_NAME}`)
})
.catch(e => {
    const msg = 'ERRO: Não foi possível conectar com o mongoDb!'
    console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
})