/*const AWS = require('aws-sdk');
const CONFIG = require('../config/config')*/
module.exports = app=>{
  /*const s3 = new AWS.S3({
    accessKeyId: CONFIG['globals']["ACCESS-ID"],
    secretAccessKey: CONFIG['globals']["AWS-SECRET-KEY"],
    signatureVersion: CONFIG['globals']["VERSION"],
    region:'us-west-2',
    httpOptions : {
      timeout : 240000,
     // agent: new HttpsProxyAgent(process.env.https_proxy)
    }
  });*/
  var startTime = new Date();
  const { existsOrError } = app.api.validation

  const save =async (req,res)=>{
    const conteudo = {...req.body}
    if(req.params.id) conteudo.id=req.params.id
    try {
      existsOrError(conteudo.name,'Titulo não informado')
      existsOrError(conteudo.desccurta,'Descrição curta não informado')
      existsOrError(conteudo.desclonga,'Descrição longa não informado')
      existsOrError(conteudo.studing,'teor da aula não informado')
      existsOrError(conteudo.id_user,'Usuário não informado')
      existsOrError(conteudo.id_disc,'Disciplina não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(conteudo.id){
      app.db('conteudos').update(conteudo)
      .where({ id: conteudo.id})
      .returning('*')
      .then(conteudo=> res.json(conteudo).status(204))
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('conteudos').insert(conteudo)
      .returning('*')
      .then(conteudo=> res.json(conteudo).status(204))
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =async(req,res)=>{
      const conteudo ={
        id:req.params.id
      }
      conteudo.deleteAt=true
      if(req.params.id) conteudo.id=req.params.id
      if(conteudo.id){
        app.db('conteudos').update(conteudo)
        .where({ id: conteudo.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(conteudo.deleteAt,'Código do conteúdo não informdo')
      }

  }


  const get= async (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users',ca:'categories',u:'users'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta','co.selected',
    {id_cat:'ca.id'},{category:'ca.name'},{id_prof: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'},
    {id_user:'u.id'},{user:'u.name'})
    .where('co.deleteAt','=',false)

    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .whereRaw('?? = ??',[ 'u.id','co.id_user'])
    .orderBy('c.name','asc')
    .distinct()
    .then(conteudos=>{res.json(conteudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getContentUser= async (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},{name_cont:'co.name'},'co.desccurta','co.selected',
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'},
    {id_user:'u.id'},{user:'u.name'})
    .where('co.deleteAt','=',false)
    .where('u.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .distinct()
    .then(conteudos=>{res.json(conteudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getSearch= async (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users',ca:'categories',u:'users'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta','co.selected',
    {id_cat:'ca.id'},{category:'ca.name'},{id_prof: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'},
    {id_user:'u.id'},{user:'u.name'})
    .where('co.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .whereRaw('?? = ??',[ 'u.id','co.id_user'])
    .orderBy('c.name','asc')
    .distinct()
  .then(conteudos=>{res.json(conteudos)})
  .catch(err=>{ res.status(500).send(err)})
  }
  const getConteudosPorDisciplina=async (req,res)=>{
    app.db({ca:'categories',c:'courses',co:'conteudos',d:'cadeiras'})
    .select('ca.id' , 'ca.name',{id_course: 'c.id'},{course:'c.name'},
    {id_cont:'co.id'},{name_cont:'co.name'},'co.desccurta','co.selected','co.ficheiro','co.image','co.imageUrl',
    'co.desclonga','co.data','co.studing',{id_disc:'d.id'},{disc_name:'d.name'})
    .where('ca.deleteAt','=',false)
    .where('d.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .distinct()
    .then(conteudos=>{res.json(conteudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getConteudosPorCurso= async(req,res)=>{
    app.db({ca:'categories',c:'courses',co:'conteudos',d:'cadeiras'})
    .select('ca.id' , 'ca.name',{id_course: 'c.id'},{course:'c.name'},
    {id_cont:'co.id'},{name_cont:'co.name'},'co.desccurta','co.selected','co.ficheiro',
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing',{id_disc:'d.id'},{disc_name:'d.name'})
    .where('co.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .distinct()
    .then(conteudos=>{res.json(conteudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById=async (req,res)=>{
    app.db('conteudos')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(conteudos=>{res.json(conteudos)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByIdSingle=async (req,res)=>{
    app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users',ca:'categories',u:'users'})
    .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta','co.selected',
    {id_cat:'ca.id'},{category:'ca.name'},{id_prof: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},
    'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'})
    .where('co.deleteAt','=',false)
    .where('co.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'co.id_user','u.id'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .whereRaw('?? = ??',[ 'u.id','co.id_user'])
    .orderBy('c.name','asc')
    .distinct()
  .first()
  .then(conteudos=>{res.json(conteudos)})
  .catch(err=>{ res.status(500).send(err)})
}

const totalConteudo= async (req,res)=>{
  app.db({c:'conteudos'})
.where('c.deleteAt','=',false)
.count(' c.id ')
.first()
.then(conteudo=>res.json(conteudo))
.catch(err=>res.status(500).send(err))
}
const getByIdSingleSearch= async (req,res)=>{
  app.db({c:'courses',co:'conteudos',d:'cadeiras',u:'users',ca:'categories',u:'users'})
  .select('co.id',{id_course: 'c.id'},{course:'c.name'},'co.name','co.desccurta','co.selected',
  {id_cat:'ca.id'},{category:'ca.name'},{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
  ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
  {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'},
  'co.desclonga','co.data','co.image','co.imageUrl','co.studing','co.ficheiro',{id_disc:'d.id'},{disc_name:'d.name'},
  {id_user:'u.id'},{user:'u.name'})
  .where('co.deleteAt','=',false)
  .where('co.name', 'like','%'+req.params.id+'%')
  .whereRaw('?? = ??',[ 'c.id','d.id_course'])
  .whereRaw('?? = ??',[ 'co.id_user','u.id'])
  .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
  .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
  .whereRaw('?? = ??',[ 'u.id','co.id_user'])
  .orderBy('c.name','asc')
  .distinct()
.then(conteudos=>{res.json(conteudos)})
.catch(err=>{ res.status(500).send(err)})
}
const uploads = async (req,res)=>{
  const file = req.file
  const url = `${process.env.ENDERECO}/file/conteudo/${req.params.id}/${file.filename}`
  res.json({file,url})
}
  const uploadsImage = async (req,res)=>{
    const file = req.file
    const url = `${process.env.ENDERECO}/image/conteudo/${req.params.id}/${file.filename}`
    res.json({file,url})
  }
  /*const startUploads= async (req,res)=>{
    try {
      let params = {
        Bucket: req.params.bucket,
        Key: req.query.fileName,
        ContentType: req.query.fileType,

      };

     return new Promise(
        (resolve, reject) => s3.createMultipartUpload(params, (err, uploadData) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.send({ uploadId: uploadData.UploadId }));
          }
        })
      );

    } catch (err) {
      console.log(err)
      return err;
    }
   }

   const getUpload = async (req, res) =>{
    try {
      let params = {
        Bucket: req.params.bucket,
        Key: req.query.fileName,
        PartNumber: req.query.partNumber,
        UploadId: req.query.uploadId
      }

      return new Promise(
        (resolve, reject) => s3.getSignedUrl('uploadPart', params, (err, presignedUrl) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.send({ presignedUrl }));
          }
        })
      );

    } catch (err) {
      console.log(err);
      return err;
    }
   }

   const completeUploads=async (req,res)=>{
    try {
      let params = {
        Bucket: req.params.bucket,
        Key: req.body.params.fileName,
        MultipartUpload: {
          Parts: req.body.params.parts
        },
        UploadId: req.body.params.uploadId,

      }
      return new Promise(
        (resolve, reject) => s3.completeMultipartUpload(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            var delta= (new Date()-startTime)/1000
            resolve(res.send({ data,delta }));
          }
        })
      );
    } catch (err) {
      //console.log(err)
      return err;
    }
   }*/
  return { save , get,removeAt,getConteudosPorCurso,getByIdSingle,getSearch,totalConteudo,
    getById,getConteudosPorDisciplina,getContentUser,getByIdSingleSearch,uploadsImage,uploads }
}
