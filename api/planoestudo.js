
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const plano = {...req.body}
    if(req.params.id) plano.id=req.params.id
    try {
      existsOrError(plano.name,'Nome não informado')
      existsOrError(plano.desccurta,'Descrição  não informada')
      existsOrError(plano.data,'Data não informada')
      existsOrError(plano.id_user,'Usuário não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(plano.id){
      app.db('plano_estudos').update(plano)
      .where({ id: plano.id})
      .returning('*')
      .then(plano=>{ res.json(plano).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('plano_estudos').insert(plano)
      .returning('*')
      .then(plano=>{ res.json(plano).status(204) })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const plano ={
        id:req.params.id
      }
      plano.deleteAt=true
      if(req.params.id) plano.id=req.params.id
      if(plano.id){
        app.db('plano_estudos').update(plano)
        .where({ id: plano.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(plano.deleteAt,'Código do plano não informdo')
      }

  }


  const get= (req,res)=>{
    app.db('plano_estudos')
    .where({deleteAt:false})
    .distinct()
    .then(plano_estudos=>{res.json(plano_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getPlanoPorUsuario=(req,res)=>{
    app.db({p:'plano_estudos',u:'users'})
    .select('p.id' , 'p.name','p.desccurta','p.data',{id_user: 'u.id'},{user:'u.name'})
    .where('p.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .distinct()
    .then(plano_estudos=>{res.json(plano_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getPlano=(req,res)=>{
    app.db({p:'plano_estudos',u:'users'})
    .select('p.id' , 'p.name','p.desccurta',{id_user: 'u.id'},{user:'u.name'})
    .where('p.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .distinct()
    .then(plano_estudos=>{res.json(plano_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById= (req,res)=>{
    app.db('plano_estudos')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(plano_estudos=>{res.json(plano_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }


  return { save , get,removeAt,getPlano,
    getById,getPlanoPorUsuario }
}
