const mongoose = require('mongoose')

require('dotenv').config({path:'variables.env'})

//conexão ao banco de dados
mongoose.connect(process.env.DATABASE, 
    { 
        useNewUrlParser: true,
        useFindAndModify:false, 
        useUnifiedTopology: true 
    })
mongoose.Promise = global.Promise
mongoose.connection.on('error', (error)=>{
    console.error("ERRO: "+error.message)
})

//carregando os models
require('./models/Post')
require('./models/User')

//puxando o app
const app = require('./app')

app.set('port', process.env.PORT || 3000)

const server = app.listen(app.get('port'), ()=>{
    console.log("Servidor rodando na porta: "+server.address().port)
})