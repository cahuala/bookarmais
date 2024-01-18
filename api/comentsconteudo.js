const queries = require('./queries')
module.exports = app=>{
    const { existsOrError } = app.api.validation
    const save=(req,res)=>{
          const comentVideo = {...req.body}
          if(req.params.id) comentVideo.id = req.params.id

          try {
                  existsOrError(comentVideo.coment,'Comentário não informado')
                  existsOrError(comentVideo.id_user,'Usuário não informado')
                  existsOrError(comentVideo.id_video,'Ficheiro não informado')


          } catch (msg) {
                  res.status(400).send(msg)
          }

          if(comentVideo.id){
              app.db('coments_video ')
                    .update(comentVideo)
                    .where({ id:comentVideo.id })
                    .where({deleteAt:false})
                    .then(_=>res.status(204).send())
                    .catch(err=>res.status(500).send(err))
          }else{
                app.db('coments_video ')
                      .insert(comentVideo)
                      .then(_=>res.status(204).send())
                      .catch(err=>res.status(500).send())
          }
    }
    const remove = async (req, res) => {
      try {
          const rowsDeleted = await app.db('coments_video ')
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
      const comentConteudo ={ ...req.body }
      comentConteudo.deleteAt=true
      if(req.params.id) comentConteudo.id=req.params.id
      if(comentConteudo.id){
        app.db('coments_video ').update(comentConteudo)
        .where({ id: comentConteudo.id})
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
          const result = await app.db(' coments_video ').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_video ', c: 'conteudos',u:'users'})
                .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{name:'c.name'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_video','c.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .limit(limit).offset( page * limit - limit )
                .then(conteudos=>res.json({ data: conteudos,count,limit}))
    }
    const getByComentsPage=async (req,res)=>{
       const page =req.query.page || 1
          const result = await app.db('coments_video').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com:'coments_video', c: 'conteudos',u:'users'})
                .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{name:'c.name'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_video','c.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .where('c.id','=',req.params.id)
                .limit(limit).offset( page * limit - limit )
                .then(conteudos=>res.json({ data: conteudos,count,limit}))
    }
    const getById= (req,res)=>{
      app.db({com: 'coments_video ', c: 'conteudos',u:'users'})
      .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{name:'c.name'},' com.data ')
      .whereRaw('?? = ??',[ 'com.id_video','c.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .where('com.id','=',req.params.id)
      .first()
      .then(conteudo=>res.json(conteudo))
      .catch(err=>res.status(500).send(err))
    }

    const getByComentsLivro= (req,res)=>{
      app.db({com: 'coments_video ', c: 'conteudos',u:'users'})
      .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{name:'c.name'},' com.data ')
      .whereRaw('?? = ??',[ 'com.id_video','c.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .where('c.id', '=',req.params.id)
      .then(conteudos=>res.json(conteudos))
      .catch(err=>res.status(500).send(err))
}

     const getByComents = async (req,res) => {
      const page =req.query.page || 1
      const result = await app.db('coments_video').count(' id ').first()
      const count = parseInt( result.count )
      app.db({com: 'coments_video ', c: 'conteudos',u:'users'})
      .select('com.id ','com.coment ','com.id_user',
      {user:'u.name'},{name:'c.name'},' com.data ')
      .whereRaw('?? = ??',[ 'com.id_video','c.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .where('c.id', '=',req.params.id)
      .orderBy('com.id','asc')
      .limit(limit).offset( page * limit - limit )
      .then(conteudos=>res.json({ data: conteudos,count,limit}))
   }

    return { save , removeAt , getById ,
      get, getByComentsLivro,
      getByComents,getByComentsPage,remove }
}
