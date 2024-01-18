
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const itensvenda = {...req.body }
    if(req.params.id) itensvenda.id=req.params.id
    try {
      existsOrError(itensvenda.data,'Data não informado')
      existsOrError(itensvenda.valor,'Valor não informado')
      existsOrError(itensvenda.id_ven,'venda não informado')
      existsOrError(itensvenda.id_bi,'Livro não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(itensvenda.id){
      app.db('itens_book').update(itensvenda)
      .where({ id: itensvenda.id})
      .returning('*')
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('itens_book')
      .insert(itensvenda)
      .returning('*')
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }


  const removeAt =(req,res)=>{
      const itensvenda ={...req.body}
      itensvenda.deleteAt=true
      if(req.params.id) itensvenda.id=req.params.id
      if(itensvenda.id){
        app.db('itens_book')
        .update(itensvenda)
        
        .where({ id: itensvenda.id})
        .returning('*')
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(itensvenda.deleteAt,'Código dos Itens não informdo')
      }

  }
    const limit=9
    const get= async (req,res)=>{
      const page =req.query.page || 1
      const result = await app.db(' itens_book ').count(' id ').first()
      const count = parseInt( result.count )
      app.db({itv: ' itens_book ', b: 'biblioteca',v:'vendas'})
      .select('itv.id' , {livro: ' b. titulo ' },{status: 'v.status '},'itv.data',' itv.valor')
      .whereRaw('?? = ??',[ 'itv.id_bi','b.id'])
      .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
      .where('itv.deleteAt','=',false)
      .limit(limit).offset( page * limit - limit )
      .then(itensvenda=>res.json({ data: itensvenda,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db({itv: ' itens_book ', b: 'biblioteca',v:'vendas'})
    .select('itv.id' , {livro: ' b. titulo ' },{status: 'v.status '},'itv.data',' itv.valor')
    .whereRaw('?? = ??',[ 'itv.id_bi','b.id'])
    .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
    .where('itv.deleteAt','=',false)
    .where('itv.id','=',req.params.id )
    .first()
    .then(itensvenda=>{res.json( itensvenda )})
    .catch(err=>{ res.status(500).send(err)})
  }
 
  const getByItensVenda = async (req,res)=>{
      app.db({itv: ' itens_venda ', b: 'biblioteca',v:'vendas'})
      .select('itv.id' , {livro: ' b. titulo ' },{status: 'v.stats '},{idVen:'v.id'},'itv.data',' itv.valor')
      .whereRaw('?? = ??',[ 'itv.id_bi','b.id'])
      .whereRaw('?? = ??',[ 'itv.id_ven','v.id'])
      .where('itv.deleteAt','=',false) 
    .where('itv.id_ven', '=', req.params.id)
    .then(vendas=>res.json(vendas))
    .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get , removeAt ,  getById , getByItensVenda }
}
