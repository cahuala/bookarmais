const queries = require('./queries')
module.exports = app=>{
    const { existsOrError } = app.api.validation
    const save=(req,res)=>{
          const comentcourse = {...req.body}
          if(req.params.id) comentcourse.id = req.params.id

          try {
                  existsOrError(comentcourse.coment,'Comentário não informado')
                  existsOrError(comentcourse.id_user,'Usuário não informado')
                  existsOrError(comentcourse.id_course,'Courso não informado')


          } catch (msg) {
                  res.status(400).send(msg)
          }

          if(comentcourse.id){
              app.db('coments_course')
                    .update(comentcourse)
                    .where({ id:comentcourse.id })
                    .where({deleteAt:false})
                    .then(_=>res.status(204).send())
                    .catch(err=>res.status(500).send(err))
          }else{
                app.db('coments_course')
                      .insert(comentcourse)
                      .then(_=>res.status(204).send())
                      .catch(err=>res.status(500).send())
          }
    }
    const remove = async (req, res) => {
      try {
          const rowsDeleted = await app.db('coments_course')
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
      const comentcourse ={ ...req.body }
      comentcourse.deleteAt=true
      if(req.params.id) comentcourse.id=req.params.id
      if(comentcourse.id){
        app.db('coments_course').update(comentcourse)
        .where({ id: comentcourse.id})
        .where({deleteAt:false})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(comentcourse.deleteAt,'Código do curso não informdo')
      }
    }
    const limit = 10 //constante para pagina
    const get = async (req,res)=>{
          const page =req.query.page || 1
          const result = await app.db(' coments_course ').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_course', c: 'courses',u:'users'})
                .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_course','c.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
    }
    const getByComentsPage=async (req,res)=>{
       const page =req.query.page || 1
          const result = await app.db(' coments_course ').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_course', c: 'courses',u:'users'})
                .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},{image:'u.image'},{imageUrl:'u.imageUrl'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_course','c.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .where('c.id','=',req.params.id)
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
    }
    const getById= (req,res)=>{
           app.db({com: 'coments_course', c: 'courses',u:'users'})
           .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},' com.data ')
           .whereRaw('?? = ??',[ 'com.id_course','c.id'])
           .whereRaw('?? = ??',[ 'com.id_user','u.id'])
           .where('com.deleteAt','=',false)
            .where('com.id','=',req.params.id)
                .first()
                .then(course=>res.json(course))
                .catch(err=>res.status(500).send(err))
    }

    const getByComentsCourse= (req,res)=>{
      app.db({com: 'coments_course', c: 'courses',u:'users'})
           .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},{image:'u.image'},{imageUrl:'u.imageUrl'},' com.data ')
           .whereRaw('?? = ??',[ 'com.id_course','c.id'])
           .whereRaw('?? = ??',[ 'com.id_user','u.id'])
           .where('com.deleteAt','=',false)
         .where('c.id', '=',req.params.id)
           .then(courses=>res.json(courses))
           .catch(err=>res.status(500).send(err))
}
const getByComentsUser= (req,res)=>{
  app.db({com: 'coments_course', c: 'courses',u:'users'})
       .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},' com.data ')
       .whereRaw('?? = ??',[ 'com.id_course','c.id'])
       .whereRaw('?? = ??',[ 'com.id_user','u.id'])
       .where('com.deleteAt','=',false)
     .where('u.name', 'like','%'+req.params.id+'%')
       .then(courses=>res.json(courses))
       .catch(err=>res.status(500).send(err))
}
   
     const getByComents = async (req,res) => {
      app.db({com: 'coments_course', c: 'courses',u:'users'})
      .select('com.id ','com.coment ','com.id_user',{user:'u.name'},{course:'c.name'},' com.data ')
      .limit(9)
      .whereRaw('?? = ??',[ 'com.id_course','c.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .orderBy('com.id','asc')
      .then(coments => res.json(coments))
      .catch(err => res.status(500).send(err))
   }
      
    return { save , removeAt , getById ,
      get, getByComentsCourse, getByComentsUser,
      getByComents,getByComentsPage,remove }
}
