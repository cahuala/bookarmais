
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const itensvenda = {...req.body }
    if(req.params.id) itensvenda.id=req.params.id
    try {
      existsOrError(itensvenda.data,'Data não informado')
      existsOrError(itensvenda.valor,'Valor não informado')
      existsOrError(itensvenda.id_ven,'venda não informado')
      existsOrError(itensvenda.id_course,'Curso não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(itensvenda.id){
      app.db('itens_venda')
      .update(itensvenda)
      .where({ id: itensvenda.id})
      .returning('*')
      .then(itens=>{ res.json(itens).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('itens_venda')
      .insert(itensvenda)
      .returning('*')
      .then(itens=>{ res.json(itens).status(204) })
      .catch(err=>{res.status(500).send(err) })
    }
  }


  const removeAt =(req,res)=>{
      const itensvenda ={...req.body}
      itensvenda.deleteAt=true
      if(req.params.id) itensvenda.id=req.params.id
      if(itensvenda.id){
        app.db('itens_venda').update(itensvenda)
        .where({ id: itensvenda.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(itensvenda.deleteAt,'Código dos Itens não informdo')
      }

  }
    const limit=9
    const get= async (req,res)=>{
      const page =req.query.page || 1
      const result = await app.db(' itens_venda ').count(' id ').first()
      const count = parseInt( result.count )
      app.db({itv: ' itens_venda ', c: 'courses',v:'vendas'})
      .select('itv.id' ,{id_curso:'c.id'}, {courses: ' c. name ' },{status: 'v.stats '},'itv.data',' itv.valor')
      .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
      .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
      .where('itv.deleteAt','=',false)
      .limit(limit).offset( page * limit - limit )
      .then(itensvenda=>res.json({ data: itensvenda,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas'})
    .select('itv.id' ,{id_curso:'c.id'}, {course: ' c. name ' },{status: 'v.stats '},'itv.data',' itv.valor')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .where('itv.deleteAt','=',false)
    .where('itv.id','=',req.params.id )
    .first()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByCourseSee= (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',ca:'categories'})
    .select('c.id' ,'c.name','c.desccurta','c.price','c.imageUrl')
    .count('c.id')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .where('c.id_cat','=', req.params.id)
    .where('itv.deleteAt','=',false)
    .where('c.deleteAt','=',false)
    .where('c.profissional','=',true)
    .groupBy('c.id','c.name','c.desccurta','c.price','c.imageUrl')
    .orderBy('count','desc')
    .distinct()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByCourseEstudentFalse= (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',ca:'categories',u:'users'})
    .select('c.id' ,'c.name','c.desccurta','c.price','c.imageUrl')
    .count('c.id')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('v.id_user','=', req.params.id)
    .where('itv.deleteAt','=',false)
    .where('c.deleteAt','=',false)
    .where('v.stats','=',false)
    .groupBy('c.id','c.name','c.desccurta','c.price','c.imageUrl')
    .orderBy('count','desc')
    .distinct()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByCourseEstudent= (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',ca:'categories',u:'users'})
    .select('c.id' ,'c.name','c.desccurta','c.price','c.imageUrl')
    .count('c.id')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('v.id_user','=', req.params.id)
    .where('itv.deleteAt','=',false)
    .where('v.stats','=',true)
    .where('c.deleteAt','=',false)
    .groupBy('c.id','c.name','c.desccurta','c.price','c.imageUrl')
    .orderBy('count','desc')
    .distinct()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByCategories= (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',ca:'categories'})
    .select('ca.id' ,'ca.name')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .where('itv.deleteAt','=',false)
    .where('c.deleteAt','=',false)
    .where('c.profissional','=',true)
    .distinct()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getTotalUsersCourse = async (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',u:'users'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('c.id', '=', req.params.id)
    .where('v.status','=',true)
    .count('c.id')
    .first()
    .then(users=>res.json( users))
    .catch(err=>{ res.status(500).send(err)})

  }
  const getCoursesSelected = async (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',u:'users'})
    .select('itv.id' ,{id_course:'c.id'} ,{courses: ' c. name ' },{status: 'v.stats '},{idVen:'v.id'},'itv.data',' itv.valor')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .where('u.id', '=', req.params.id)
    .where('c.deleteAt','=',false)
    .then(users=>res.json( users))
    .catch(err=>{ res.status(500).send(err)})

  }
  const getCoursesVendaUsers = async (req,res)=>{
    app.db({itv: ' itens_venda ', c: 'courses',v:'vendas',u:'users'})
    .select('itv.id' ,
    {id_course:'c.id'} ,
    {courses: ' c. name ' },
    {user:'u.name'},
    'u.email',
    'u.telefone',
    {venda:'v.valor'},
    {data_venda:'v.data'},
    {status: 'v.stats '},
    {idVen:'v.id'},'itv.data',' itv.valor')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('c.id', '=', req.params.id)
    .where('c.deleteAt','=',false)
    .then(users=>res.json( users))
    .catch(err=>{ res.status(500).send(err)})

  }
  const getByItensVenda = async (req,res)=>{
      app.db({itv: ' itens_venda ', c: 'courses',v:'vendas'})
      .select('itv.id' , {courses: ' c. name ' },{status: 'v.stats '},{idVen:'v.id'},'itv.data',' itv.valor')
      .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
      .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
      .where('itv.deleteAt','=',false)
    .where('itv.id_ven', '=', req.params.id)
    .then(vendas=>res.json(vendas))
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get , removeAt ,  getById,getCoursesVendaUsers , getByItensVenda,getByCourseEstudent,getByCourseEstudentFalse,
    getTotalUsersCourse,getCoursesSelected,getByCourseSee,getByCategories }
}
