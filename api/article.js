const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const article = { ...req.body }
        if(req.params.id) article.id = req.params.id

        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .returning('*')
                .then(article=> res.json(article).status(204))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .returning('*')
                .then(article=> res.json(article).status(204))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const get = async (req, res) => {
        app.db('articles')
            .select('id', 'name', 'description')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }
    const uploads = async (req,res)=>{
      const file = req.file
      const url = `${process.env.ENDERECO}/upload/article/file/${req.params.id}/${file.filename}`
      res.json({file,url})
    }
    const uploadsImagem = async (req,res)=>{
      const file = req.file
      const url = `${process.env.ENDERECO}/upload/article/image/${req.params.id}/${file.filename}`
      res.json({file,url})
    }
    const getByIdTeacher = async (req,res)=>{
      app.db({a: ' articles ', u: 'users'})
      .select('a.id ', ' a.name ','a.description',' a.imageUrl ', ' a.dateC ',{id_user:'a.userId'}, {author: ' u.name '}, {phone: ' u.telefone '})
      .whereRaw('?? = ??',[ 'a.userId','u.id'])
      //.where('a.deletedAt','=',false)
      .where( 'a.userId','=', req.params.id)
      .orderBy('a.id','asc')
      .then(articles => res.json(articles))
      .catch(err => res.status(500).send(err))
     }
    const removeAt =(req,res) =>{
      const article ={
        id: req.body.id
       }
       article.deletedAt=true
      if(req.params.id) article.id=req.params.id
      if(article.id){
        app.db('articles').update(article)
        .where({ id: article.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(article.deleteAt,'Código do Artigo não informdo')
      }
    }
    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }
    const getByArticlesCategories = async (req,res) => {
      app.db({a: 'articles', u: 'users'})
            .select(' a.id', 'a.name', 'a.description', 'a.imageUrl','a.dateC',{id_user:'a.userId'}, { author: 'u.name' })
            .whereRaw('?? = ??',[ 'a.userId','u.id'])
            .where('a.deleteAt','=',false)
            .where('a.categoryId','=', req.params.id)
            .orderBy('a.id','asc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
 }
 const getTotalArticlesTeacher= async(req,res)=>{
  app.db({a: 'articles', u: 'users'})
  .whereRaw('?? = ??',[ 'a.userId','u.id'])
  .where('a.deleteAt','=',false)
 .where( 'u.id','=', req.params.id)
 .count('a.id ')
 .first()
 .then(articles=>res.json(articles))
 .catch(err=>res.status(500).send(err))

}
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl',{id_user:'a.userId'}, { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('a.categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, uploadsImagem,getByCategory,getTotalArticlesTeacher,
      removeAt,getByIdTeacher,uploads,getByArticlesCategories }
}
