
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const plano = {...req.body}
    if(req.params.id) plano.id=req.params.id
    try {
      existsOrError(plano.name,'Nome não informado')
      existsOrError(plano.description,'Descrição  não informada')
      existsOrError(plano.data,'Data não informada')
      //existsOrError(plano.price,'Preço não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(plano.id){
      app.db('planos').update(plano)
      .where({ id: plano.id})
      .returning('*')
      .then(plano=>{ res.json(plano).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('planos').insert(plano)
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
        app.db('planos').update(plano)
        .where({ id: plano.id})
        .returning('*')
      .then(plano=>{ res.json(plano).status(204) })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(plano.deleteAt,'Código do plano não informdo')
      }

  }


  const get= (req,res)=>{
    app.db('planos')
    .where({deleteAt:false})
    .distinct()
    .then(planos=>{res.json(planos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getPackage= async (req,res)=>{
    const page =req.query.page || 1
    const result = await app.db(' planos ').count(' id ').first()
    const count = parseInt( result.count )
    app.db('planos')
    .where({deleteAt:false})
    .limit(limit).offset( page * limit - limit )
    .distinct()
    .then(planos=>{res.json({ data: planos,count,limit})})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getPlanosAssinado= (req,res)=>{
    app.db({p:'planos',a:'assinar_planos'})
    .whereRaw('?? = ??',[ 'p.id','a.id_plano'])
    .where('p.deleteAt','=',false)
    .distinct()
    .then(planos=>{res.json(planos)})
    .catch(err=>{ res.status(500).send(err)})
  }

    const getById= (req,res)=>{
    app.db('planos')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(planos=>{res.json(planos)})
    .catch(err=>{ res.status(500).send(err)})
  }


  return { save , get,removeAt,getPlanosAssinado,
    getById,getPackage }
}
