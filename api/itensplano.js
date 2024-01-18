
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const plano = {...req.body}
    if(req.params.id) plano.id=req.params.id
    try {

      existsOrError(plano.dificuldade,'Nível de dificuldade não informado')
      existsOrError(plano.data,'Data não informada')
      existsOrError(plano.id_cont,'Conteúdo não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(plano.id){
      app.db('itens_plano').update(plano)
      .where({ id: plano.id})
      .returning('*')
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('itens_plano')
      .insert(plano)
      .returning('*')
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const itens_plano ={
        id:req.params.id
      }
      itens_plano.deleteAt=true
      if(req.params.id) itens_plano.id=req.params.id
      if(itens_plano.id){
        app.db('itens_plano')
        .update(itens_plano)
        .returning('*')
        .where({ id: itens_plano.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(itens_plano.deleteAt,'Código do Item não informdo')
      }

  }
  const remove = async (req, res) => {
    try {
        const rowsDeleted = await app.db('itens_plano')
            .where({ id: req.params.id }).del()

        try {
            existsOrError(rowsDeleted, 'Item não foi encontrado.')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        res.status(204).send()
    } catch(msg) {
        res.status(500).send(msg)
    }
}

  const get= (req,res)=>{
    app.db('itens_plano')
    .where({deleteAt:false})
    .distinct()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const limit=15
  const getItpPlanoPorUsuario=async (req,res)=>{
    const page = req.query.page || 1
    const result = await  app.db({p:'plano_estudos',u:'users',itp:'itens_plano',c:'conteudos'})
                                            .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
                                            {dificuldade:'itp.dificuldade'},{id_cont:'c.id'},{cont_name:'c.name'},
                                            {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
                                            .where('itp.deleteAt','=',false)
                                            .where('u.id','=',req.params.id)
                                            .whereRaw('?? = ??',[ 'p.id_user','u.id'])
                                            .whereRaw('?? = ??',[ 'itp.id_cont','c.id'])
                                            .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
                                            .distinct().count('id').first()
                                            const count = parseInt(result.count)

    app.db({p:'plano_estudos',u:'users',itp:'itens_plano',c:'conteudos'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
    {dificuldade:'itp.dificuldade'},{id_cont:'c.id'},{cont_name:'c.name'},'c.ficheiro','c.ficheiroUrl',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
    .limit(limit).offset(page * limit - limit)
    .where('itp.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'itp.id_cont','c.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>{res.json({data: itens_plano, count, limit })})
  .catch(err=>{ res.status(500).send(err)})
  }
  const getItpPlanoPorPlanos=async (req,res)=>{
    const page =req.query.page || 1
    const result = await app.db('itens_plano').count(' id ').first()
    const count = parseInt( result.count )
    app.db({p:'plano_estudos',u:'users',uu:'users',itp:'itens_plano',c:'conteudos'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},'c.ficheiro','c.ficheiroUrl','c.desccurta',
    'c.desclonga','c.data','c.image','c.imageUrl','c.studing',
    {dificuldade:'itp.dificuldade'},{id_cont:'c.id'},{cont_name:'c.name'},'c.selected',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'},{id_prof:'uu.id'},{prof:'uu.name'})
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'c.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'itp.id_cont','c.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .limit(limit).offset( page * limit - limit )
    .distinct()
    .then(itens_plano=>res.json({data: itens_plano,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getItpPlanoPorPlanosAll=async (req,res)=>{
    app.db({p:'plano_estudos',u:'users',uu:'users',itp:'itens_plano',c:'conteudos'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},'c.ficheiro','c.ficheiroUrl','c.desccurta',
    'c.desclonga','c.data','c.image','c.imageUrl','c.studing',
    {dificuldade:'itp.dificuldade'},{id_cont:'c.id'},{cont_name:'c.name'},'c.selected',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'},{id_prof:'uu.id'},{prof:'uu.name'})
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'c.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'itp.id_cont','c.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>res.json({ itens_plano}))
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById= (req,res)=>{
    app.db('itens_plano')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getItpPlanoVerificacao=(req,res)=>{
    app.db({p:'plano_estudos',u:'users',itp:'itens_plano',c:'conteudos'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
    {dificuldade:'itp.dificuldade'},{id_cont:'c.id'},{cont_name:'c.name'},
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .where('c.id','=',req.params.id_itp)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'itp.id_cont','c.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }
  return { save , get,removeAt,getItpPlanoPorPlanos,getItpPlanoPorPlanosAll,
    getById,getItpPlanoPorUsuario,remove,getItpPlanoVerificacao }
}
