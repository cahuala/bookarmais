
module.exports = app=>{
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const config_conteudo = {
      id_conteudo: req.body.id_conteudo,
      id:req.body.id_config,
      id_user: req.body.id_estudent,
      selected: req.body.selected,
      read:req.body.read,
      watch:req.body.watch
    }
    if(req.params.id) config_conteudo.id=req.params.id
    try {
      existsOrError(config_conteudo.id_user,'Usuário não informado')
      existsOrError(config_conteudo.id_conteudo,'Conteúdo  não informado')

    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(config_conteudo.id){
      app.db('config_conteudo').update(config_conteudo)
      .where({ id: config_conteudo.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('config_conteudo').insert(config_conteudo)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const get= (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users',uu:'users',ca:'categories',u:'users',cc:'config_conteudo'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta'
    ,'cc.selected','cc.read','cc.watch',{id_config:'cc.id'},
    {id_cat:'ca.id'},{category:'ca.name'},{id_prof: 'u.id'},{author: 'u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},{id_estudent: 'uu.id'},{estudent:'uu.name'},
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'})
    .where('co.deleteAt','=',false)
    .where('uu.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .whereRaw('?? = ??',[ 'cc.id_conteudo','co.id'])
    .whereRaw('?? = ??',[ 'u.id','co.id_user'])
    .whereRaw('?? = ??',[ 'cc.id_user','uu.id'])
    .orderBy('co.name','asc')
    .distinct()
  .then(conteudos=>{res.json(conteudos)})
  .catch(err=>{ res.status(500).send(err)})
  }
  const getUser= (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',uu:'users',u:'users',ca:'categories',u:'users',cc:'config_conteudo'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta'
    ,'cc.selected','cc.read','cc.watch',{id_config:'cc.id'},{id_conteudo:'co.id'},
    {id_cat:'ca.id'},{category:'ca.name'},{id_prof: 'u.id'},{author: 'u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},{id_estudent: 'uu.id'},{estudent:'uu.name'},
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'})
    .where('co.deleteAt','=',false)
    .where('uu.id','=',req.params.id_user)
    .where('co.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .whereRaw('?? = ??',[ 'cc.id_conteudo','co.id'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'cc.id_user','uu.id'])
    .orderBy('co.name','asc')
    .first()
    .distinct()
  .then(conteudos=>{res.json(conteudos)})
  .catch(err=>{ res.status(500).send(err)})
  }

  return { save , get, getUser }
}
