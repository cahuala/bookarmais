
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const visualizacao = {...req.body}
    if(req.params.id) visualizacao.id=req.params.id
    try {
      existsOrError(visualizacao.id_user,'Usuário não informado')
      existsOrError(visualizacao.data,'Data não informada')
      existsOrError(visualizacao.id_cont,'Conteúdo não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(visualizacao.id){
      app.db('visualizacoes').update(visualizacao)
      .where({ id: visualizacao.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('visualizacoes').insert(visualizacao)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const visualizacao ={
        id:req.params.id
      }
      visualizacao.deleteAt=true
      if(req.params.id) visualizacao.id=req.params.id
      if(visualizacao.id){
        app.db('visualizacoes').update(visualizacao)
        .where({ id: visualizacao.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(visualizacao.deleteAt,'Código da visualização não informdo')
      }

  }


  const get= (req,res)=>{
    app.db('visualizacoes')
    .where({deleteAt:false})
    .distinct()
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getVisualizacaoPorUsuarioAgrupadoData=(req,res)=>{
    app.db({u:'users',c:'conteudos',v:'visualizacoes'})
    .select('c.id','c.name','c.desccurta', 'v.data','v.mes',{id_user: 'u.id'},{user:'u.name'})
    .where('c.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .distinct()
    .groupBy('v.data')
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getVisualizacaoPorConteudoAgrupadoData=(req,res)=>{
    app.db({u:'users',c:'conteudos',v:'visualizacoes'})
    .select('c.id','c.name','c.desccurta', 'v.data','v.mes',{id_user: 'u.id'},{user:'u.name'})
    .where('c.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .distinct()
    .groupBy('v.data')
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getVisualizacaoPorConteudoAgrupadoMes=(req,res)=>{
    app.db({u:'users',c:'conteudos',v:'visualizacoes'})
    .select('c.id','c.name','c.desccurta', 'v.data','v.mes',{id_user: 'u.id'},{user:'u.name'})
    .where('c.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .distinct()
    .groupBy('v.mes')
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getVisualizacaoPorUsuarioAgrupadoMes=(req,res)=>{
    app.db({u:'users',c:'conteudos',v:'visualizacoes'})
    .select('c.id','c.name','c.desccurta', 'v.data','v.mes',{id_user: 'u.id'},{user:'u.name'})
    .where('c.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .distinct()
    .groupBy('v.mes')
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById= (req,res)=>{
    app.db('visualizacoes')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(visualizacoes=>{res.json(visualizacoes)})
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get,removeAt,getVisualizacaoPorConteudoAgrupadoData,getVisualizacaoPorConteudoAgrupadoMes,
    getById,getVisualizacaoPorUsuarioAgrupadoData,getVisualizacaoPorUsuarioAgrupadoMes }
}
