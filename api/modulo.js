
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const modulo ={...req.body}
    if(req.params.id) modulo.id=req.params.id
    try {
      existsOrError(modulo.name,'Modulo não informado')
      existsOrError(modulo.id_course,'Curso não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(modulo.id){
      app.db('modulo')
      .update(modulo)
      .where({ id: modulo.id})
      .returning('*')
      .then(modulo=>{ res.json(modulo).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('modulo').insert(modulo)
      .returning('*')
      .then(modulo=>{ res.json(modulo).status(204) })
      .catch(err=>{res.status(500).send(err) })
    }
  }


  const removeAt =(req,res)=>{
      const modulo ={...req.body}
      modulo.deleteAt=true
      if(req.params.id) modulo.id=req.params.id
      if(modulo.id){
        app.db('modulo').update(modulo)
        .where({ id: modulo.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(modulo.deleteAt,'Código do modulo não informdo')
      }

  }

    const get= (req,res)=>{
      app.db({m: ' modulo ', c: 'courses'})
      .select('m.id ', 'm.name ','m.description','m.id_course', {course: ' c.name '})
      .whereRaw('?? = ??',[ 'm.id_course','c.id'])
    .where('m.deleteAt','=',false)
    .orderBy('c.name','asc')
    .then(modulos=>{res.json(modulos)})
    .catch(err=>{ res.status(500).send(err)})
  }
const limit=10
  const getModulePage=async (req,res)=>{
    const page = req.query.page || 1
    const result = await app.db('modulo').count('id').first()
    const count = parseInt(result.count)
    app.db({m: ' modulo ', c: 'courses'})
    .select('m.id ', 'm.name ','m.description','m.id_course', {course: ' c.name '})
    .limit(limit).offset(page * limit - limit)
  .whereRaw('?? = ??',[ 'm.id_course','c.id'])
  .where('m.deleteAt','=',false)
  .where('m.id_course','=',req.params.id)
  .orderBy('c.name','asc')
  .then(modulos=>{res.json({data: modulos, count, limit })})
  .catch(err=>{ res.status(500).send(err)})
}
  const getById= (req,res)=>{
    app.db('modulo')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(modulo=>{res.json(modulo)})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getByModulo = (req,res)=>{
    app.db({m: ' modulo ', c: 'courses'})
    .select('m.id ', 'm.name ','m.description', {course: ' c.name '})
    .whereRaw('?? = ??',[ 'm.id_course','c.id'])
    .where('m.name', 'like',`%${ req.params.id }%`)
    .then(modulos=>{res.json(modulos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByModuloCourse = (req,res)=>{
    app.db({m: ' modulo ', c: 'courses'})
    .select('m.id ', 'm.name ','m.description', {course: ' c.name '})
    .whereRaw('?? = ??',[ 'm.id_course','c.id'])
    .where('m.id_course', '=',req.params.id )
    .then(modulos=>{res.json(modulos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  return { save , get , removeAt , getById ,
     getByModulo,getByModuloCourse,getModulePage}
}
