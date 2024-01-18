
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const venda = {...req.body }
    if(req.params.id) venda.id=req.params.id
    try {
      existsOrError(venda.data,'Data não informado')
      existsOrError(venda.valor,'Valor não informado')
      existsOrError(venda.id_user,'Estudante não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(venda.id){
      app.db('vendas').update(venda)
      .where({ id: venda.id})
      .returning('*')
      .then(venda=>{ res.json(venda).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('vendas')
      .insert(venda)
      .returning('id')
      .then(id=>{ res.json(parseInt(id)) })
      .catch(err=>{res.status(500).send(err) })
    }
  }


  const removeAt =(req,res)=>{
      const venda ={...req.body}
      venda.deleteAt=true
      if(req.params.id) venda.id=req.params.id
      if(venda.id){
        app.db('vendas').update(venda)
        .where({ id: venda.id})
        .returning('*')
      .then(venda=>{ res.json(venda).status(204) })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(venda.deleteAt,'Código da Venda não informdo')
      }

  }
  const editarVenda =(req,res)=>{
    const venda = {
      id:req.params.id,
      stats:req.body.stats,
      mod:req.body.mod
    }
    if(req.params.id) venda.id=req.params.id
    if(venda.id){
      app.db('vendas').update(venda)
      .where({ id: venda.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      existsOrError(venda.deleteAt,'Código da Matricula não informdo')
    }

}
    const limit=10
    const get= async (req,res)=>{
      app.db({v: ' vendas ', u: 'users'})
      .select('v.id',' u. name ','u.telefone ','u.watshapp','v.valor','v.data',' v.stats')
      .whereRaw('?? = ??',[ 'v.id_user','u.id'])
      .where('v.deleteAt','=',false)
      .then(vendas=>res.json(vendas))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getVendaPorUsuario= async (req,res)=>{
    app.db({v: ' vendas ', u: 'users'})
    .select('v.id',' u. name ','u.telefone ','u.watshapp','v.valor','v.data',' v.stats')
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('v.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .then(vendas=>res.json(vendas))
  .catch(err=>{ res.status(500).send(err)})
}
  const getVendasAdm= async (req,res)=>{
    app.db({v: ' vendas ', u: 'users'})
    .select('v.id',' u.name ','u.telefone ','u.watshapp','v.valor','v.data',' v.stats')
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('v.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .then(vendas=>res.json(vendas))
  .catch(err=>{ res.status(500).send(err)})
}
const getVendasAdmClientes= async (req,res)=>{
  const page =req.query.page || 1
      const result = await  app.db({v: ' vendas ', u: 'users'})
      .select('u.id',' u.name ','u.telefone ','u.watshapp')
      .whereRaw('?? = ??',[ 'v.id_user','u.id'])
      .where('u.deleteAt','=',false).groupBy('u.id').count('u.id ').first()
      const count = parseInt( result.count )

  app.db({v: ' vendas ', u: 'users'})
  .select('u.id',' u.name ','u.telefone ','u.watshapp')
  .whereRaw('?? = ??',[ 'v.id_user','u.id'])
  .where('u.deleteAt','=',false)
  .limit(limit).offset( page * limit - limit )
  .distinct()
    .then(vendas=>res.json({vendas:vendas,limit,count}))
.catch(err=>{ res.status(500).send(err)})
}
  const getById= (req,res)=>{
    app.db('vendas')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(venda=>{res.json(venda)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getTotalEsdunt = async (req,res)=>{
    app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .select('v.stats','itv.data')
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('c.id','=', req.params.id).count('*')
    .groupBy('v.stats','itv.data')
    .distinct()
    .then(inscritos=>{res.json(inscritos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getEstudentIscritos= async (req,res)=>{
    const resultNPago = await app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('v.stats','=',false)
    .where('c.id','=', req.params.id)
    .count('* ').first()
    const countNPago=parseInt( resultNPago.count )
   const resultPago = await app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('v.stats','=',true)
    .where('c.id','=', req.params.id)
    .count('*').first()


    const countPago=parseInt( resultPago.count )
    app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .select('itv.id', {courses: ' c.name ' },{status: 'v.stats'},{idVenda:'v.id'},'itv.data',' itv.valor',
    {user:'u.name'},{telefone:'u.telefone'},{email:'u.email'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('c.id','=', req.params.id)
    .distinct()
    .then(inscritos=>{res.json( {data:inscritos,countPago,countNPago} )})
    .catch(err=>{ res.status(500).send(err)})

  }
  const getEstudentIscritosDataSem= (req,res)=>{
    app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .select('itv.id',{idCurso:'c.id'}, {courses: ' c.name ' },{status: 'v.stats'},{idVenda:'v.id'},'itv.data',' itv.valor',
    {user:'u.name'},{telefone:'u.telefone'},{email:'u.email'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('c.id','=', req.params.id)
    .where('v.id','=', req.params.idVenda)
    .where('itv.data','=',req.params.data)
    .where('v.stats','=',req.params.status)
    .distinct()
    .then(inscritos=>{res.json( inscritos )})
    .catch(err=>{ res.status(500).send(err)})
  }
  // Função para pesquisar a compra de cursos por usuarios
  const getVendaUserTrue = (req,res)=>{
    app.db({v:'vendas',u:'users'})
          .select('v.id','v.stats','v.data')
          .whereRaw('?? = ??',[ 'v.id_user','u.id'])
          .where('v.deleteAt','=',false)
          .where('v.stats','=',true)
          .where('u.id','=',req.params.id)
          .then(vendas=>{res.json(vendas)})
          .catch(err=>{ res.status(500).send(err)})
  }
  // Pegar as venda por usuários não pago
  const getVendaUserFalse = (req,res)=>{
    app.db({v:'vendas',u:'users'})
          .select('v.id','v.stats','v.data')
          .whereRaw('?? = ??',[ 'v.id_user','u.id'])
          .where('v.deleteAt','=',false)
          .where('v.stats','=',false)
          .where('u.id','=',req.params.id)
          .then(vendas=>{res.json(vendas)})
          .catch(err=>{ res.status(500).send(err)})
  }
  // Itens das vendas por usuários com a compra não paga
  const getItvVendaUserFalse = (req,res)=>{
    app.db({itv:'itens_venda',v:'vendas',c:'courses'})
    .select('itv.id_course',{course: ' c.name ' },{idCourse:'c.id'})
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('v.stats','=',false)
    .where('v.id','=',req.params.id)
    .then(vendas=>{res.json(vendas)})
    .catch(err=>{ res.status(500).send(err)})
  }
  // Pegar os Itens da venda por usuario com a compra paga
  const getItvVendaUserTrue = (req,res)=>{
    app.db({itv:'itens_venda',v:'vendas',c:'courses'})
    .select('itv.id_course',{course: ' c.name ' },{idCourse:'c.id'})
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .where('itv.deleteAt','=',false)
    .where('v.deleteAt','=',false)
    .where('v.stats','=',true)
    .where('v.id','=',req.params.id)
    .then(vendas=>{res.json(vendas)})
    .catch(err=>{ res.status(500).send(err)})
  }
  // Estudante Inscritos por Data
  const getEstudentIscritosData= (req,res)=>{
    app.db({itv:'itens_venda', c:'courses',v:'vendas',u:'users'})
    .select('itv.id', {courses: ' c.name ' },{status: 'v.stats'},{idVenda:'v.id'},'itv.data',' itv.valor',
    {user:'u.name'},{telefone:'u.telefone'},{email:'u.email'})
    .whereRaw('?? = ??',[ 'itv.id_course','c.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('itv.deleteAt','=',false)
    .where('c.id','=', req.params.id)
    .where('v.id','=',req.params.idVenda)
    //.where('itv.data','=', req.params.data)
    .where('v.stats','=',req.params.status)
    .distinct()
    .then(inscritos=>{res.json( inscritos )})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByVenda = async (req,res)=>{
    const page =req.query.page || 1
      const result = await app.db(' vendas ').count(' id ').first()
      const count = parseInt( result.count )
    app.db({v: ' vendas ', u: 'users'})
    .select('v.id' , {student: ' u. name ' },{phone: 'u.telefone '},'v.data',' v.stats')
    .whereRaw('?? = ??',[ 'v.id_user','u.id'])
    .where('u.name', 'like',`%${ req.params.id }%`)
    .limit(limit).offset( page * limit - limit )
    .then(vendas=>res.json({ data: vendas,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get , removeAt ,  getById ,getVendasAdm,getVendasAdmClientes,
    getByVenda,getEstudentIscritos,getItvVendaUserFalse,getItvVendaUserTrue,editarVenda,
    getEstudentIscritosData,getVendaUserFalse,getVendaUserTrue,getVendaPorUsuario,
    getEstudentIscritosDataSem,getTotalEsdunt }
}
