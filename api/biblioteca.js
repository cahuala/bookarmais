/*const AWS = require('aws-sdk');
const CONFIG = require('../config/config')
*/
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
    const biblioteca = {...req.body}
    if(req.params.id) biblioteca.id=req.params.id
    try {
      existsOrError(biblioteca.titulo,'Titulo não informado')
      existsOrError(biblioteca.isbn,'ISBN não informado')
      existsOrError(biblioteca.data,'Data não informada')
      existsOrError(biblioteca.desccurta,'Descrição não informado')
      existsOrError(biblioteca.ficheiro,'Ficheiro não informado')
      existsOrError(biblioteca.image,'Imagem não informado')
      existsOrError(biblioteca.id_user,'Usuário não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(biblioteca.id){
      app.db('biblioteca')
      .update(biblioteca)
      .where({ id: biblioteca.id})
      .returning('*')
      .then(biblioteca=> res.json(biblioteca).status(204))
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('biblioteca')
      .insert(biblioteca)
      .returning('*')
      .then(biblioteca=> res.json(biblioteca).status(204))
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const biblioteca ={
        id:req.params.id
      }
      biblioteca.deleteAt=true
      if(req.params.id) biblioteca.id=req.params.id
      if(biblioteca.id){ 
        app.db('biblioteca')
        .update(biblioteca)
        .where({ id: biblioteca.id})
        .returning('*')
        .then(biblioteca=> res.json(biblioteca).status(204))
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(biblioteca.deleteAt,'Código da Biblioteca não informdo')
      }

  }


  const get= (req,res)=>{
    app.db({b:'biblioteca',u:'users',cc:'categories'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.data','b.download','b.id_cat','b.image','b.imageUrl','b.selected',
    'b.ficheiro','b.price',{id_prof:'u.id'},{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{category:'cc.name'},
    {endereco:'u.endereco'},{imageUserUrl:'u.imageUrl'},{imageUser:'u.image'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'b.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_cat','cc.id'])
    .distinct()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getBibliotecaPorUsuario=(req,res)=>{
    app.db({b:'biblioteca',u:'users',c:'categories'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.data','b.download','b.image','b.imageUrl','b.selected',
    'b.ficheiro',{id_prof:'u.id'},'b.price',{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{category:'c.name'},
    {endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'b.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_cat','c.id'])
    .where('u.id','=',req.params.id)
    .distinct()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getTotalBooksTeacher= async(req,res)=>{
    app.db({b:'biblioteca',u:'users'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'b.id_user','u.id'])
   .where( 'u.id','=', req.params.id)
   .count(' u.id ')
   .first()
   .then(book=>res.json(book))
   .catch(err=>res.status(500).send(err))

 }
  const getBibliotecaPorCategories=(req,res)=>{
    app.db({b:'biblioteca',u:'users',c:'categories'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.price','b.image','b.imageUrl','b.selected'
    ,'b.download','b.data','b.price',{id_cat:'c.id'},{category:'c.name'},'b.price','b.isbn','b.desclonga ',
    'b.ficheiro',{id_prof:'u.id'},{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},
    {endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'b.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_cat','c.id'])
    .limit(9)
    .orderBy('c.id','asc')
    .distinct()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
    const getById= (req,res)=>{
      app.db({b:'biblioteca',u:'users',cc:'categories'})
      .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.data','b.download','b.desclonga','b.selected','b.data','b.image','b.imageUrl'
      ,'b.download','b.ficheiro',{category:'cc.name'},'b.price','b.id_cat',{id_prof:'u.id'},{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
      ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},{endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
      {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
      .where('b.deleteAt','=',false)
      .whereRaw('?? = ??',[ 'b.id_user','u.id'])
      .whereRaw('?? = ??',[ 'b.id_cat','cc.id'])
      .where('b.id','=',req.params.id)
    .first()
    .then(biblioteca=>{res.json(biblioteca)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByBibliotecaName= (req,res)=>{
    app.db({b:'biblioteca',u:'users',c:'categories'})
    .select('b.id' , 'b.titulo','b.desccurta','b.isbn','b.price','b.image','b.imageUrl','b.selected'
    ,'b.download','b.data',{id_prof:'u.id'},{id_cat:'c.id'},{category:'c.name'},'b.isbn','b.desclonga ',
    'b.ficheiro',{id_user: 'u.id'},{author: ' u.name '}, {phone: ' u.telefone '}
    ,{whatsapp:'u.watshapp'},{telefone:'u.phone'},
    {endereco:'u.endereco'},{imageUser:'u.image'},{imageUserUrl:'u.imageUrl'},
    {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
    .where('b.deleteAt','=',false)
    .whereRaw('?? = ??',[ 'b.id_user','u.id'])
    .whereRaw('?? = ??',[ 'b.id_cat','c.id'])
    .where('b.name', 'like','%'+req.params.id+'%')
    .then(courses=>res.json(courses))
    .catch(err=>res.status(500).send(err))
}
  const uploads = async (req,res)=>{
    const file = req.file
    const url = `${process.env.ENDERECO}/mage/book/${req.params.id}/${file.filename}`
      res.json({file,url})

  }
  const uploadsImage = async (req,res)=>{
    const file = req.file
    const url = `${process.env.ENDERECO}/file/book/${req.params.id}/${file.filename}`
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
  return { save , get,removeAt,getBibliotecaPorUsuario,getTotalBooksTeacher,
    getById,uploads,uploadsImage ,getBibliotecaPorCategories,getByBibliotecaName}
}
