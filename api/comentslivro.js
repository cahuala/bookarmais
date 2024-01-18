const queries = require('./queries')
module.exports = app=>{
    const { existsOrError } = app.api.validation
    const save=(req,res)=>{
          const comentlivro = {...req.body}
          if(req.params.id) comentlivro.id = req.params.id

          try {
                  existsOrError(comentlivro.coment,'Comentário não informado')
                  existsOrError(comentlivro.id_user,'Usuário não informado')
                  existsOrError(comentlivro.id_livro,'livro não informado')


          } catch (msg) {
                  res.status(400).send(msg)
          }

          if(comentlivro.id){
              app.db('coments_livro')
                    .update(comentlivro)
                    .where({ id:comentlivro.id })
                    .where({deleteAt:false})
                    .then(_=>res.status(204).send())
                    .catch(err=>res.status(500).send(err))
          }else{
                app.db('coments_livro')
                      .insert(comentlivro)
                      .then(_=>res.status(204).send())
                      .catch(err=>res.status(500).send())
          }
    }
    const remove = async (req, res) => {
      try {
          const rowsDeleted = await app.db('coments_livro')
              .where({ id: req.params.id }).del()

          try {
              existsOrError(rowsDeleted, 'Comentário não foi encontrado.')
          } catch(msg) {
              return res.status(400).send(msg)
          }

          res.status(204).send()
      } catch(msg) {
          res.status(500).send(msg)
      }
  }
    const removeAt =(req,res) =>{
      const comentlivro ={ ...req.body }
      comentlivro.deleteAt=true
      if(req.params.id) comentlivro.id=req.params.id
      if(comentlivro.id){
        app.db('coments_livro').update(comentlivro)
        .where({ id: comentlivro.id})
        .where({deleteAt:false})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(comentlivro.deleteAt,'Código do livro não informdo')
      }
    }
    const limit = 10 //constante para pagina
    const get = async (req,res)=>{
          const page =req.query.page || 1
          const result = await app.db(' coments_livro').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_livro', b: 'biblioteca',u:'users'})
                .select('com.id ','com.coment ','com.id_user','b.id_cat',{user:'u.name'},{livro:'b.titulo'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_livro','b.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .limit(limit).offset( page * limit - limit )
                .then(livros=>res.json({ data: livros,count,limit}))
    }
    const getByComentsPage=async (req,res)=>{
       const page =req.query.page || 1
          const result = await app.db(' coments_livro ').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_livro', b: 'biblioteca',u:'users'})
                .select('com.id ','com.coment ','com.id_user','b.id_cat',{user:'u.name'},{livro:'b.titulo'},{image:'u.image'},{imageUrl:'u.imageUrl'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_livro','b.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .where('b.id','=',req.params.id)
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
    }
    const getById= (req,res)=>{
           app.db({com: 'coments_livro', b: 'biblioteca',u:'users'})
           .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{livro:'b.titulo'},' com.data ')
           .whereRaw('?? = ??',[ 'com.id_livro','b.id'])
           .whereRaw('?? = ??',[ 'com.id_user','u.id'])
           .where('com.deleteAt','=',false)
            .where('com.id','=',req.params.id)
                .first()
                .then(livro=>res.json(livro))
                .catch(err=>res.status(500).send(err))
    }

    const getByComentsLivro= (req,res)=>{
      app.db({com: 'coments_livro', b: 'biblioteca',u:'users'})
           .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{livro:'b.titulo'},{image:'u.image'},{imageUrl:'u.imageUrl'},'com.data')
           .whereRaw('?? = ??',[ 'com.id_livro','b.id'])
           .whereRaw('?? = ??',[ 'com.id_user','u.id'])
           .where('com.deleteAt','=',false)
         .where('b.id', '=',req.params.id)
           .then(livros=>res.json(livros))
           .catch(err=>res.status(500).send(err))
}

     const getByComents = async (req,res) => {
      app.db({com: 'coments_livro', b: 'biblioteca',u:'users'})
      .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{livro:'b.titulo'},' com.data ')
      .limit(9)
      .whereRaw('?? = ??',[ 'com.id_livro','b.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .orderBy('com.id','asc')
      .then(coments => res.json(coments))
      .catch(err => res.status(500).send(err))
   }

    return { save , removeAt , getById ,
      get, getByComentsLivro,
      getByComents,getByComentsPage,remove }
}
