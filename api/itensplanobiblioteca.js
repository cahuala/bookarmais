
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const plano = {...req.body}
    if(req.params.id) plano.id=req.params.id
    try {

      existsOrError(plano.dificuldade,'Nível de dificuldade não informado')
      existsOrError(plano.data,'Data não informada')
      existsOrError(plano.id_bi,'Livro não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(plano.id){
      app.db('itens_biblioteca').update(plano)
      .where({ id: plano.id})
      .returning('*')
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('itens_biblioteca')
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
        app.db('itens_biblioteca')
        .update(itens_plano)
        .where({ id: itens_plano.id})
        .returning('*')
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(itens_plano.deleteAt,'Código do Item não informdo')
      }

  }


  const get= (req,res)=>{
    app.db('itens_biblioteca')
    .where({deleteAt:false})
    .distinct()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const limit=15
  const getItpPlanoPorUsuario=async (req,res)=>{
    const page =req.query.page || 1
    const result = await   app.db({p:'plano_estudos',u:'users',itp:'itens_biblioteca',b:'biblioteca'})
                                              .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
                                              {dificuldade:'itp.dificuldade'},{id_bi:'b.id'},{livro:'b.titulo'},
                                              {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
                                              .where('itp.deleteAt','=',false)
                                              .where('p.id','=',req.params.id)
                                              .whereRaw('?? = ??',[ 'p.id_user','u.id'])
                                              .whereRaw('?? = ??',[ 'itp.id_bi','b.id'])
                                              .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
                                              .count('b.id ').first()
    const count = parseInt( result.count )
    app.db({p:'plano_estudos',u:'users',itp:'itens_biblioteca',b:'biblioteca'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
    {dificuldade:'itp.dificuldade'},{id_bi:'b.id'},{livro:'b.titulo'},'b.ficheiro','b.ficheiroUrl',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
    .limit(limit).offset( page * limit - limit )
    .where('itp.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'itp.id_bi','b.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    
    .distinct()
    .then(itens_plano=>res.json({ data: itens_plano,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
 
  const getItpPlanoPorPlanos=async (req,res)=>{
    const page =req.query.page || 1
    const result = await app.db('itens_biblioteca').count(' id ').first()
    const count = parseInt( result.count )
    app.db({p:'plano_estudos',u:'users',uu:'users',itp:'itens_biblioteca',b:'biblioteca'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
    {dificuldade:'itp.dificuldade'},{id_bi:'b.id'},{livro:'b.titulo'},'b.ficheiro','b.ficheiroUrl',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'},{id_prof:'uu.id'},{prof:'uu.name'})
    .limit(limit).offset( page * limit - limit )
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'itp.id_bi','b.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>res.json({ data: itens_plano,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getItpBibliotecaPorPlanosAll=async (req,res)=>{
    app.db({p:'plano_estudos',u:'users',uu:'users',itp:'itens_biblioteca',b:'biblioteca'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},'b.desccurta',
    'b.isbn','b.price','b.image','b.imageUrl','b.selected'
    ,'b.download','b.data','b.price',
    {dificuldade:'itp.dificuldade'},{id_cont:'b.id'},{livro:'b.titulo'},'b.ficheiro','b.ficheiroUrl',
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'},{id_prof:'uu.id'},{prof:'uu.name'})
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'itp.id_bi','b.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>res.json({ itens_plano}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getItpPlanoVerificacao=(req,res)=>{
    app.db({p:'plano_estudos',u:'users',itp:'itens_biblioteca',b:'biblioteca'})
    .select('p.id' , 'p.name','p.desccurta',{data:'itp.data'},
    {dificuldade:'itp.dificuldade'},{id_bi:'b.id'},{livro:'b.titulo'},
    {id_itv:'itp.id'}, {id_user: 'u.id'},{user:'u.name'})
    .where('itp.deleteAt','=',false)
    .where('p.id','=',req.params.id)
    .where('b.id','=',req.params.id_itp)
    .whereRaw('?? = ??',[ 'p.id_user','u.id'])
    .whereRaw('?? = ??',[ 'itp.id_bi','b.id'])
    .whereRaw('?? = ??',[ 'itp.id_plano','p.id'])
    .distinct()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const remove = async (req, res) => {
    try {
        const rowsDeleted = await app.db('itens_biblioteca')
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
    const getById= (req,res)=>{
    app.db('itens_biblioteca')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(itens_plano=>{res.json(itens_plano)})
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get,removeAt,getItpPlanoPorPlanos,getItpBibliotecaPorPlanosAll,
    getById,getItpPlanoPorUsuario,remove,getItpPlanoVerificacao }
}
