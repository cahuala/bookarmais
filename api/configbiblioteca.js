
module.exports = app=>{
  const { existsOrError, notExistsOrError } = app.api.validation

  const save =async (req,res)=>{
    const config_biblioteca = {
      id_biblioteca: req.body.id_biblioteca,
      id:req.body.id_config,
      id_user: req.body.id_student,
      selected: req.body.selected,
      read:req.body.read
    }

    if(req.params.id) config_biblioteca.id=req.params.id
    try {
      existsOrError(config_biblioteca.id_user,'Usuário não informado')
      existsOrError(config_biblioteca.id_biblioteca,'Livro  não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(config_biblioteca.id){
      app.db('config_biblioteca').update(config_biblioteca)
      .where({ id: config_biblioteca.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('config_biblioteca').insert(config_biblioteca)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const get= (req,res)=>{
    app.db({b:'biblioteca',u:'users',uu:'users',cc:'categories',c:'config_biblioteca'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.price','b.image','b.imageUrl',
    'b.selected','c.selected','c.read',{id_config:'c.id'},{id_biblioteca:'b.id'},
    'b.download','b.data',{id_cat:'cc.id'},{category:'cc.name'},'b.price','b.isbn','b.desclonga ',
    'b.ficheiro',{id_prof:'uu.id'},{author: 'uu.name'},{id_student: 'u.id'},{student: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},
    {endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'b.id','c.id_biblioteca'])
    .whereRaw('?? = ??',[ 'b.id_cat','cc.id'])
    .where('u.id','=',req.params.id)
    .distinct()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getUser= (req,res)=>{
    app.db({b:'biblioteca',u:'users',uu:'users',cc:'categories',c:'config_biblioteca'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.price','b.image','b.imageUrl',
    'b.selected','c.selected','c.read',{id_config:'c.id'},{id_biblioteca:'b.id'},
    'b.download','b.data',{id_cat:'cc.id'},{category:'cc.name'},'b.price','b.isbn','b.desclonga ',
    'b.ficheiro',{id_student: 'u.id'},{id_prof: 'uu.id'},{author: 'uu.name '},{student: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},
    {endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'c.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_user','uu.id'])
    .whereRaw('?? = ??',[ 'b.id','c.id_biblioteca'])
    .whereRaw('?? = ??',[ 'b.id_cat','cc.id'])
    .where('u.id','=',req.params.id_user)
    .where('b.id','=',req.params.id)
    .first()
    .distinct()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
  return { save , get, getUser }
}
