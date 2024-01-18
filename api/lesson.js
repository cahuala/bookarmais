/*const AWS = require('aws-sdk');
const CONFIG = require('../config/config')*/
module.exports = app => {
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
    const lesson = {...req.body }
    if(req.params.id) lesson.id=req.params.id
    try {
      existsOrError(lesson.name,'Titulo não informado')
      existsOrError(lesson.id_course,'Curso não informado')
      existsOrError(lesson.id_mod,'Modulo não informado')
      existsOrError(lesson.tipoficheiro,'Tipo de ficheiro não informado')
      existsOrError(lesson.ficheiro,'Ficheiro não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(lesson.id){
      app.db('lessons').update(lesson)
      .where({ id: lesson.id})
      .returning('*')
      .then(lesson=>{ res.json(lesson).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('lessons')
      .insert(lesson)
      .returning('*')
      .then(lesson=>{ res.json(lesson).status(204) })
      
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const removeAt =(req,res)=>{
      const lesson ={...req.body}
      lesson.deleteAt=true
      if(req.params.id) lesson.id=req.params.id
      if(lesson.id){
        app.db('lessons').update(lesson)
        .where({ id: lesson.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(lesson.deleteAt,'Código da Aula não informdo')
      }

  }
  const limit=9
    const get= async (req,res)=>{
      const page =req.query.page || 1
      const result = await app.db(' lessons ').where({deleteAt:false}).count(' id ').first()
      const count = parseInt( result.count )
    app.db({l:'lessons',c:'courses'})
    .select('l.id' , 'l.name','l.description','l.tipoficheiro','l.ficheiro ','l.ficheiroUrl',{course:'c.name'})
    .whereRaw('?? =??',['l.id_course','c.id'])
    .where('l.deleteAt','=',false)
    .limit(limit).offset( page * limit - limit )
    .then(lessons=>res.json({ data: lessons,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
 const getByLessonCourses= async (req,res)=>{
  app.db({l:'lessons',c:'courses',m:'modulo'})
    .select('l.id' , 'l.name','l.description','l.tipoficheiro','l.ficheiroUrl',
    ' l.ficheiro','l.data',{id_mod:'m.id'},{course:'c.name'},{modulo:'m.name'})
    .whereRaw('?? =??',['l.id_course','c.id'])
    .whereRaw('?? =??',['l.id_mod','m.id'])
    .where('l.deleteAt','=',false)
    .where('l.id_course','=', req.params.id )
    .then(lesson=>{res.json(lesson)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByLessonModulo= async (req,res)=>{
    app.db({l:'lessons',c:'courses',m:'modulo'})
    .select('l.id' , 'l.name','l.description','l.tipoficheiro','l.ficheiroUrl',
    ' l.ficheiro','l.data',{course:'c.name'},{id_mod:'m.id'},{modulo:'m.name'})
    .whereRaw('?? =??',['l.id_course','c.id'])
    .whereRaw('?? =??',['l.id_mod','m.id'])
    .where('l.deleteAt','=',false)
    .where('l.id_mod','=', req.params.id )
    .then(lesson=>{res.json(lesson)})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getByLessonAll= async (req,res)=>{
    app.db({l:'lessons',c:'courses',m:'modulo'})
    .select('l.id' , 'l.name','l.description','l.tipoficheiro',' l.ficheiro','l.ficheiroUrl'
    ,'l.data',{course:'c.name'},{id_mod:'m.id'},{modulo:'m.name'})
    .whereRaw('?? =??',['l.id_course','c.id'])
    .whereRaw('?? =??',['l.id_mod','m.id'])
    .where('l.deleteAt','=',false)
    .then(lesson=>{res.json(lesson)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db('lessons')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(lesson=>{res.json(lesson)})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getByLesson = async (req,res)=>{
    const page =req.query.page || 1
      const result = await app.db(' lessons ')
                      .where({deleteAt:false})
                      .where('name', 'like',`%${ req.params.id }%`)
                      .count(' id ').first()
      const count = parseInt( result.count )
    app.db({l:'lessons',c:'courses'})
    .select('l.id' , 'l.name','l.description','l.tipoficheiro',' l.ficheiro','l.ficheiroUrl',{course:'c.name'})
    .whereRaw('?? =??',['l.id_course','c.id'])
    .where('l.deleteAt','=',false)
    .where('l.name', 'like',`%${ req.params.id }%`)
    .limit(limit).offset( page * limit - limit )
    .then(lessons=>res.json({ data: lessons,count,limit}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const uploads = async (req,res)=>{
    const file = req.file
    const url = `${process.env.ENDERECO}/module/aula/${req.params.id}/${file.filename}`
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
 //console.log(params)
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
  return { save , get , removeAt ,
    getById , getByLesson,getByLessonCourses,
    getByLessonModulo,uploads,getByLessonAll }
}
