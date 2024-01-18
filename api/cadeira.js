
module.exports = app=>{
  const { existsOrError, notExistsOrError } = app.api.validation

  const save =async (req,res)=>{
    const cadeira = {...req.body}
    if(req.params.id) cadeira.id=req.params.id
    try {
      existsOrError(cadeira.name,'Nome não informado')
      existsOrError(cadeira.id_course,'Curso  não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(cadeira.id){
      app.db('cadeiras').update(cadeira)
      .where({ id: cadeira.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('cadeiras').insert(cadeira)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const cadeira ={
        id:req.params.id
      }
      cadeira.deleteAt=true
      if(req.params.id) cadeira.id=req.params.id
      if(cadeira.id){
        app.db('cadeiras').update(cadeira)
        .where({ id: cadeira.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(cadeira.deleteAt,'Código da cadeira não informdo')
      }

  }


  const get= (req,res)=>{
    app.db({ca:'categories',c:'courses',cad:'cadeiras'})
    .select('cad.id' , 'cad.name',{id_course: 'c.id'},{course:'c.name'},
    {id_cat:'ca.id'},{categoria:'ca.name'})
    .where('cad.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'c.id','cad.id_course'])
    .distinct()
    .then(cadeiras=>{res.json(cadeiras)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCadeiraPorCurso=(req,res)=>{
    app.db({ca:'categories',c:'courses',cad:'cadeiras'})
    .select('cad.id' , 'cad.name',{id_course: 'c.id'},{course:'c.name'},
    {id_cat:'ca.id'},{categoria:'ca.name'})
    .where('cad.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'c.id','cad.id_course'])
    .distinct()
    .then(cadeiras=>{res.json(cadeiras)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getConteudosPorCategorias=(req,res)=>{
    app.db({ca:'categories',c:'courses',cad:'cadeiras'})
    .select('cad.id' , 'cad.name',{id_course: 'c.id'},{course:'c.name'},
    {id_cat:'ca.id'},{categoria:'ca.name'})
    .where('cad.deleteAt','=',false)
    .where('ca.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'c.id','cad.id_course'])
    .distinct()
    .then(cadeiras=>{res.json(cadeiras)})
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById= (req,res)=>{
    app.db('cadeiras')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(cadeiras=>{res.json(cadeiras)})
    .catch(err=>{ res.status(500).send(err)})
  }


  return { save , get,removeAt,getConteudosPorCategorias,
    getById,getCadeiraPorCurso,get }
}
