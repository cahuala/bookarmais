
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const assinar = {...req.body}
    if(req.params.id) assinar.id=req.params.id
    try {
      existsOrError(assinar.id_user,'Nome não informado')
      existsOrError(assinar.data,'Data não informada')

    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(assinar.id){
      app.db('assinar_planos')
      .update(assinar)
      .where({ id: assinar.id})
      .returning('*')
      .then(assinar=> res.json(assinar).status(204))
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('assinar_planos')
      .insert(assinar)
      .returning('*')
      .then(assinar=> res.json(assinar).status(204))
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const assinar ={
        id:req.params.id
      }
      assinar.deleteAt=true
      if(req.params.id) assinar.id=req.params.id
      if(assinar.id){
        app.db('assinar_planos')
        .update(assinar)
        .where({ id: assinar.id})
        .returning('*')
        .then(assinar=> res.json(assinar).status(204))
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(assinar.deleteAt,'Código do plano não informdo')
      }

  }


  const get= (req,res)=>{
    app.db({a:'assinar_planos',u:'users',p:'planos'})
    .select('a.id' ,{id_plano:'p.id'}, 'p.name','a.status','a.change','p.descrption','a.data',{id_user: 'u.id'},{user:'u.name'})
    .where('a.deleteAt','=',false)
  .whereRaw('?? = ??',[ 'a.id_user','u.id'])
  .whereRaw('?? = ??',[ 'p.id','a.id_plano'])
    .distinct()
    .then(assinar=>{res.json(assinar)})
    .catch(err=>{ res.status(500).send(err)})
  }


    const getById= (req,res)=>{
      app.db({a:'assinar_planos',u:'users',p:'planos'})
      .select('p.id' ,{id_plano:'p.id'}, 'p.name','a.status','a.change','p.descrption','a.data',{id_user: 'u.id'},{user:'u.name'})
      .where('a.deleteAt','=',false)
      .where('a.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'a.id_user','u.id'])
    .whereRaw('?? = ??',[ 'p.id','a.id_plano'])
    .first()
    .then(assinar_planos=>{res.json(assinar_planos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getPlanoPorUsuario=(req,res)=>{
    app.db({a:'assinar_planos',u:'users',p:'planos'})
    .select('a.id' ,{id_plano:'p.id'}, 'p.name','a.status','a.change','p.descrption','a.data',{id_user: 'u.id'},{user:'u.name'},'u.email')
    .where('a.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'a.id_user','u.id'])
    .whereRaw('?? = ??',[ 'p.id','a.id_plano'])
    .distinct()
    .then(assinar=>{res.json(assinar)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getUsuarioPorPlano=(req,res)=>{
    app.db({a:'assinar_planos',u:'users',p:'planos'})
    .select('p.id' ,{id_plano:'p.id'}, 'p.name','a.status','a.change','a.data',
    {id_user: 'u.id'},{user:'u.name'},{email:'u.email'})
    .where('a.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'a.id_user','u.id'])
    .whereRaw('?? = ??',[ 'p.id','a.id_plano'])
    .distinct()
    .then(assinar=>{res.json(assinar)})
    .catch(err=>{ res.status(500).send(err)})
  }
  return { save , get,removeAt,getUsuarioPorPlano,
    getById,getPlanoPorUsuario }
}
