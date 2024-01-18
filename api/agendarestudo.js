
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const agendaPlano = {...req.body}
    if(req.params.id) agendaPlano.id=req.params.id
    try {

      existsOrError(agendaPlano.estado,'estado não informado')
      existsOrError(agendaPlano.data,'Data não informada')
      existsOrError(agendaPlano.id_plano,'Ficheiro não informado')
      existsOrError(agendaPlano.id_user,'Usuário não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(agendaPlano.id){
      app.db('agendar_estudos').update(agendaPlano)
      .where({ id: agendaPlano.id})
      .returning('*')
      .then(agenda=>{ res.json(agenda).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('agendar_estudos')
      .insert(agendaPlano)
      .returning('*')
      .then(agenda=>{ res.json(agenda).status(204) })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const agendar_estudos ={
        id:req.params.id
      }
      agendar_estudos.deleteAt=true
      if(req.params.id) agendar_estudos.id=req.params.id
      if(agendar_estudos.id){
        app.db('agendar_estudos').update(agendar_estudos)
        .where({ id: agendar_estudos.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(agendar_estudos.deleteAt,'Código  não informdo')
      }

  }


  const get= (req,res)=>{
    app.db('agendar_estudos')
    .where({deleteAt:false})
    .distinct()
    .then(agendar_estudos=>{res.json(agendar_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getAgendaPorUsuario=(req,res)=>{
    app.db({a:'agendar_estudos',u:'users',p:'plano_estudos'})
    .select('a.id' , 'a.estado','b.desccurta','a.data','a.diaSemana',
    {id_user: 'u.id'},{user:'u.name'},{id_plano:'p.id'},{plano:'p.name'})
    .where('b.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'a.id_user','u.id'])
    whereRaw('?? = ??',[ 'a.id_plano','p.id'])
    .distinct()
    .then(agendar_estudos=>{res.json(agendar_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }

    const getById= (req,res)=>{
    app.db('agendar_estudos')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(agendar_estudos=>{res.json(agendar_estudos)})
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get,removeAt,getAgendaPorUsuario,
    getById }
}
