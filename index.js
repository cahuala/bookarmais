require('dotenv').config()
const app =require('express')()
const express = require('express')
const consign = require('consign')
const cors = require('cors')
const path = require('path')
const db = require('./config/db')


app.db = db

const corsOption ={
  origin:'*',
  optionsSuccessStatus:200
}

app.use(cors(corsOption))
// routa para pegar imagem do livro
app.use('/image/book/:id', (req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve(__dirname,'tmp','lib','image',`${req.params.id}`))(req,res,next)
})
// routa para pegar o livro
app.use('/file/book/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve(__dirname,'tmp','lib','file',`${req.params.id}`))(req,res,next)
})
// routa para pegar a imagem do curso
app.use('/image/course/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve(__dirname,'tmp','course','image',`${req.params.id}`))(req,res,next)
})
// routa para pegar o video de apresentação do curso
app.use('/video/course/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve(__dirname,'tmp','course','video',`${req.params.id}`))(req,res,next)
})
// routa para pegar a imagem do artigo
app.use('/image/article/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','article','image',`${req.params.id}`))(req,res,next)
})
// routa para pegar o IBAN dos professores
app.use('/filesBanco/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','banco',`${req.params.id}`))(req,res,next)
})

// routa para pegar as aulas por modulo
app.use('/module/aula/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','module',`${req.params.id}`))(req,res,next)
})

// routa para pegar os comprovativo de pagamento de venda
app.use('/pagamento/venda/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','pagamentos','venda',`${req.params.id}`))(req,res,next)
})

// routa para pegar os comprovativo de pagamento do plano
app.use('/pagamento/plano/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','pagamentos','plano',`${req.params.id}`))(req,res,next)
})
// routa para adicionar foto de perfil do usuário
app.use('/image/user/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','user','image',`${req.params.id}`))(req,res,next)
})

// routa conteudo
app.use('/image/conteudo/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','conteudo','image',`${req.params.id}`))(req,res,next)
})

// routa conteudo file
app.use('/file/conteudo/:id',(req,res,next)=>{
  req.url=path.basename(req.originalUrl)
  express.static(path.resolve( __dirname,'tmp','conteudo','file',`${req.params.id}`))(req,res,next)
})

let port = process.env.PORT || 3000

consign()
      .then('./config/router_file.js')
      .then('./config/passport.js')
      .then('./config/middlewares.js')
      .then('./api/validation.js')
      .then('./api')
      .then('./config/router.js')
      .into(app)

app.listen(port,()=>{
    console.log('Backend Executando...')
})
