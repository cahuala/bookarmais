const queries = require('./queries')
module.exports = app=>{
    const { existsOrError } = app.api.validation
    const save=(req,res)=>{
          const comentlesson = { 
            id:req.body.id,
            coment: req.body.coment,
            id_user: req.body.id_user,
            id_lesson:req.body.id_lesson,
            data:req.body.data
           }
          if(req.params.id) comentlesson.id = req.params.id

          try {  
                  existsOrError(comentlesson.coment,'Comentário não informado')
                  existsOrError(comentlesson.id_user,'Usuário não informado')
                  existsOrError(comentlesson.id_lesson,'Aula não informado')
          } catch (msg) {
                  res.status(400).send(msg)
          }
 
          if(comentlesson.id){
              app.db('coments_lesson')
                    .update(comentlesson)
                    .where({ id:comentlesson.id })
                    .then(_=>res.status(204).send())
                    .catch(err=>res.status(500).send(err))
          }else{
            
                app.db('coments_lesson')
                      .insert(comentlesson)
                      .then(_=>res.status(204).send())
                      .catch(err=>res.status(500).send())
          }
    }
    const removeAt =(req,res) =>{ 
      const comentlesson ={ ...req.body }
      comentlesson.deleteAt=true
      if(req.params.id) comentlesson.id=req.params.id
      if(comentlesson.id){
        app.db('coments_lesson').update(comentlesson)
        .where({ id: comentlesson.id})
        .where({deleteAt:false})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(comentlesson.deleteAt,'Código do curso não informdo')
      }
    }
    const limit = 9 //constante para pagina
    const get = async (req,res)=>{
          const page =req.query.page || 1
          const result = await app.db(' coments_lesson ').count(' id ').first()
          const count = parseInt( result.count )
          app.db({com: 'coments_lesson', l: 'lessons',u:'users'})
                .select('com.id ','com.coment ',{user:'u.name'},{lesson:'l.name'},' com.data ')
                .whereRaw('?? = ??',[ 'com.id_lesson','l.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
    }
    const getById= (req,res)=>{
      app.db({com: 'coments_lesson', l: 'lessons',u:'users'})
      .select('com.id ','com.coment ',{user:'u.name'},{lesson:'l.name'},' com.data ')
      .whereRaw('?? = ??',[ 'com.id_lesson','l.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
            .where('com.id','=',req.params.id)
                .first()
                .then(course=>res.json(course))
                .catch(err=>res.status(500).send(err))
    }

    const getByComentsLesson= async (req,res)=>{
      const page =req.query.page || 1
      const result = await app.db(' coments_lesson ').count(' id ').first()
      const count = parseInt( result.count )
      app.db({com: 'coments_lesson', l: 'lessons',u:'users'})
                .select('com.id ','com.coment ',{id_user:'u.id'},{user:'u.name'},{lesson:'l.name'})
                .whereRaw('?? = ??',[ 'com.id_lesson','l.id'])
                .whereRaw('?? = ??',[ 'com.id_user','u.id'])
                .where('com.deleteAt','=',false)
                .where('l.id','=',req.params.id)
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
           .catch(err=>res.status(500).send(err))
}
const getByComentsUser= (req,res)=>{
  app.db({com: 'coments_lesson', l: 'lessons',u:'users'})
  .select('com.id ','com.coment ',{user:'u.name'},{lesson:'l.name'},' com.data ')
  .whereRaw('?? = ??',[ 'com.id_lesson','l.id'])
  .whereRaw('?? = ??',[ 'com.id_user','u.id'])
  .where('com.deleteAt','=',false)
     .where('u.name', 'like','%'+req.params.id+'%')
       .then(courses=>res.json(courses))
       .catch(err=>res.status(500).send(err))
}
   
     const getByComents = async (req,res) => {
      app.db({com: 'coments_lesson', l: 'lessons',u:'users'})
                .select('com.id ','com.coment ',{user:'u.name'},{lesson:'l.name'},' com.data ')  
      .limit(9)
      .whereRaw('?? = ??',[ 'com.id_lesson','l.id'])
      .whereRaw('?? = ??',[ 'com.id_user','u.id'])
      .where('com.deleteAt','=',false)
      .orderBy('com.id','asc')
      .then(coments => res.json(coments))
      .catch(err => res.status(500).send(err))
   }
   const remove = async (req, res) => {
    try {
        const rowsDeleted = await app.db('coments_lesson')
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
    return { save , removeAt , getById ,
      get, getByComentsLesson, getByComentsUser,
      getByComents,remove }
}
