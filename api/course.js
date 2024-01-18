const queries = require('./queries')
/*const AWS = require('aws-sdk');
const CONFIG = require('../config/config')
//const HttpsProxyAgent = require( 'https-proxy-agent')
const Upload = require('@aws-sdk/lib-storage')
const S3Client = require('@aws-sdk/client-s3')*/
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
    const save=(req,res)=>{
          const course = { ...req.body }
          if(req.params.id) course.id = req.params.id
          try {
                  existsOrError(course.name,'Nome não informado')
                  existsOrError(course.id_cat,' Categoria não informada')
                  existsOrError(course.id_user,'Professor não informado')
          } catch (msg) {
                  res.status(400).send(msg)
          }

          if(course.id){
            console.log(course)
              app.db('courses')
                    .update(course)
                    .where({id:course.id })
                    .returning('*')

                    .then(course=>res.json(course).status(204))
                    .catch(err=>res.status(500).send(err))
          }else{
                app.db('courses')
                      .insert(course)
                      .returning('*')

                      .then(course=>res.json(course).status(204))
                      .catch(err=>res.status(500).send())
          }
    }
    const saveEdit=(req,res)=>{
      const course = { ...req.body }
      if(req.params.id) course.id = req.params.id

      if(course.id){
          app.db('courses')
                .update(course)
                .where({id:course.id })
                .then(_=>res.status(204).send())
                .catch(err=>res.status(500).send(err))
      }
}
    const edit=(req,res)=>{
      const course = {
        id:req.params.id,
        status:req.body.status
         }
      if(req.params.id) course.id = req.params.id
      if(course.id){
          app.db('courses')
                .update(course)
                .where({id:course.id })
                .returning('*')
                .then(_=>res.status(204).send())
                .catch(err=>res.status(500).send(err))
      }
}
    const removeAt = async (req,res) =>{
      const course ={
        id: req.body.id
       }
      course.deleteAt=true
      if(req.params.id) course.id=req.params.id
      if(course.id){
        app.db('courses').update(course)
        .where({ id: course.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(course.deleteAt,'Código do curso não informdo')
      }
    }
    const limit = 9 //constante para pagina
    const get = async (req,res)=>{
          const page =req.query.page || 1
          const result = await app.db(' courses ').count(' id ').first()
          const count = parseInt( result.count )
          app.db('courses')
                .select(' id ',' name ',' desccurta ',' desclonga ','c.status',
                'videoUrl',' image ',' imageUrl ',' price ','id_cat','id_user')
                .where({deleteAt:false})
                .where({status:true})
                .limit(limit).offset( page * limit - limit )
                .then(courses=>res.json({ data: courses,count,limit}))
    }
    const getTotalCourse= async(req,res)=>{
      const result = await app.db(' courses ')
      .where({deleteAt:false})
      .where({status:true})
      .count(' id ').first()
      const count = parseInt( result.count )
      app.db('courses')
            .select(' id ',' name ',' desccurta ',' desclonga ',
            'videoUrl',' image ',' imageUrl ',' price ','id_cat','id_user')
            .where({deleteAt:false})
            .then(courses=>res.json({ data: courses,count}))
            .catch(err=>{ res.status(500).send(err)})

    }
    const getTotalCourseTeacher= async(req,res)=>{
       app.db({c:'courses',u: 'users'})
      
      .whereRaw('?? = ??',[ 'c.id_user','u.id'])
      .where('c.deleteAt','=',false)
      .where( 'u.id','=', req.params.id)
      .where('c.status','=',true)
      .where('c.profissional','=',true)
      .count('u.id ')
      .first()
      .then(course=>res.json(course))
      .catch(err=>res.status(500).send(err))

    }
    const getById=async (req,res)=>{
      app.db('courses')
      .where({ id: req.params.id })
      .first()
      .then(course=>res.json(course))
      .catch(err=>res.status(500).send(err))
    }
const getByIdCourseAllInformation= async (req,res)=>{
  app.db({c: 'courses ', u: 'users'})
  .select('c.id ', 'c.name ', 'c.desccurta ','c.status',
  'c.desccurta ','c.desclonga','c.req ','c.studing',
  'c.image','c.imageUrl','c.videoUrl','c.video','c.id_cat', ' c.price ',
   'c.id_user', {author: ' u.name '}
   ,{whatsapp:'u.watshapp'},{phone:'u.phone'},
   {endereco:'u.endereco'},{imageUserUrl:'u.imageUrl'},{imageUser:'u.image'},
   {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
  .whereRaw('?? = ??',[ 'c.id_user','u.id'])
  .where('c.deleteAt','=',false)
  .where( 'c.id','=', req.params.id)
  .where('c.status','=',true)
  .where('c.profissional','=',true)
  .first()
  .then(course=>res.json(course))
  .catch(err=>res.status(500).send(err))
}
const getByCourseAllInformation= async (req,res)=>{
  app.db({c: 'courses ', u: 'users'})
  .select('c.id ', 'c.name ', 'c.desccurta ',
  'c.desccurta ','c.desclonga','c.req','c.studing', ' c.image ','c.status', 'c.imageUrl','c.videoUrl','c.video','c.id_cat', ' c.price ',
   'c.id_user', {author: ' u.name '}
   ,{whatsapp:'u.watshapp'},{phone:'u.phone'},
   {endereco:'u.endereco'},{imageUser:'u.image'},
   {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
  .whereRaw('?? = ??',[ 'c.id_user','u.id'])
  .where('c.deleteAt','=',false)
  .where('c.status','=',true)
  .where('c.profissional','=',true)
  .then(course=>res.json(course))
  .catch(err=>res.status(500).send(err))
}
const getByCourseStatsFalseAllInformation= async (req,res)=>{
  app.db({c: 'courses ', u: 'users'})
  .select('c.id ', 'c.name ', 'c.desccurta ','c.status',
  'c.desccurta ','c.desclonga','c.req ','c.studing',
  'c.image','c.imageUrl','c.videoUrl','c.video','c.id_cat', ' c.price ',
   'c.id_user', {author: ' u.name '}
   ,{whatsapp:'u.watshapp'},{phone:'u.phone'},
   {endereco:'u.endereco'},{imageUserUrl:'u.imageUrl'},{imageUser:'u.image'},
   {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
  .whereRaw('?? = ??',[ 'c.id_user','u.id'])
  .where('c.deleteAt','=',false)
  .where('c.profissional','=',true)
  .then(course=>res.json(course))
  .catch(err=>res.status(500).send(err))
}
const getByCourseTeacherAllInformation= async (req,res)=>{
  app.db({c: 'courses ', u: 'users'})
  .select('c.id ', 'c.name ', 'c.desccurta ','c.status',
  'c.desccurta ','c.desclonga','c.req ','c.studing',
  'c.image','c.imageUrl','c.videoUrl','c.video','c.id_cat', ' c.price ',
   'c.id_user', {author: ' u.name '}
   ,{whatsapp:'u.watshapp'},{phone:'u.phone'},
   {endereco:'u.endereco'},{imageUserUrl:'u.imageUrl'},{imageUser:'u.image'},
   {email:'u.email'},{telefone:'u.telefone'},{nota:'u.nota'})
  .whereRaw('?? = ??',[ 'c.id_user','u.id'])
  .where('c.deleteAt','=',false)
  .where('c.profissional','=',true)
  .where('u.id','=',req.params.id)
  .then(course=>res.json(course))
  .catch(err=>res.status(500).send(err))
}
    const getByCourseName= async (req,res)=>{
      app.db({c: 'courses ', u: 'users'})
         .select('c.id ', 'c.name ', 'c.desccurta ','c.status',
         'c.desccurta ','c.desclonga','c.req ','c.studing',
         ' c.image ',  ' c.imageUrl','c.videoUrl','c.video','c.id_cat', ' c.price ', 'c.id_user', {author: ' u.name '}, {phone: ' u.telefone '})
         .whereRaw('?? = ??',[ 'c.id_user','u.id'])
         .where('c.name', 'like','%'+req.params.id+'%')
          .where('c.deleteAt','=',false)
          .where('c.status','=',true)
          .where('c.profissional','=',true)
           .then(courses=>res.json(courses))
           .catch(err=>res.status(500).send(err))
}
     const getByCategory = async (req,res) => {
        const categoryId = req.params.id
          const page = req.query.page || 1
          const categories = await app.db.raw(queries.categoryWithChildrean,categoryId)
          const ids = categories.raws.map(c=>c.id)

          app.db({c: ' courses ', u: 'users'})
                .select(' c.id ', ' c.name ', ' c.desccurta ', ' c.desccurta ','c.desclonga','c.req '
                ,'c.studing', ' c.image ','c.status', ' c.imageUrl ','c.videoUrl','c.video','c.id_cat',' c.price ', 'c.id_user', {author: ' u.name '}, {phone: ' u.telefone '})
                .limit(limit).offset(page * limit - limit)
                .whereRaw('?? = ??',[ 'c.id_user','u.id'])
                .whereIn('c.id_cat',ids)
                .where('c.deleteAt','=',false)
                .where('c.profissional','=',true)
                .where('c.status','=',true)
                .orderBy('c.id','desc')
                .then(articles => res.json(articles))
                .catch(err => res.status(500).send(err))
     }
     const getByIdTeacher = async (req,res)=>{
      app.db({c: ' courses ', u: 'users'})
      .select('c.id ', ' c.name ',' c.image ',' c.imageUrl ','c.videoUrl','c.video', ' c.price ','c.status', 'c.id_cat', 'c.id_user',{author: ' u.name '}, {phone: ' u.telefone '})
      .whereRaw('?? = ??',[ 'c.id_user','u.id'])
      .where('c.deleteAt','=',false)
      .where('c.profissional','=',true)
      .where( 'c.id_user','=', req.params.id)
      .orderBy('c.id','asc')
      .then(courses => res.json(courses))
      .catch(err => res.status(500).send(err))
     }
     const uploads = async (req,res)=>{

       const file = {...req.file}
       const url = `${process.env.ENDERECO}/video/course/${req.params.id}/${file.filename}`
       res.json({file,url})
     }
     const uploadsImage = async (req,res)=>{
      const file = {...req.file}
    
      const url = `${process.env.ENDERECO}/image/course/${req.params.id}/${file.filename}`
      res.json({file,url})
    }
/*
     const startUploads= async (req,res)=>{
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
     const getByCourses = async (req,res) => {
        app.db({c: ' courses ', u: 'users'})
              .select(' c.id ', ' c.name ', ' c.desccurta ','c.desclonga','c.req ','c.status',
              'c.studing', ' c.image ',  ' c.imageUrl ', ' c.price ','c.videoUrl','c.video', 'c.id_cat','c.id_user', {author: ' u.name '}, {phone: ' u.telefone '})
              .whereRaw('?? = ??',[ 'c.id_user','u.id'])
              .where('c.deleteAt','=',false)
              .where('c.profissional','=',true)
              .where('c.status','=',true)
              .orderBy('c.id','asc')
              .then(courses => res.json(courses))
              .catch(err => res.status(500).send(err))
   }
      const getByCoursesCategories = async (req,res) => {
        app.db({c: ' courses ', u: 'users'})
              .select(' c.id ', ' c.name ', ' c.desccurta ',
              'c.desclonga','c.req ','c.studing','c.id_user','c.id_cat','c.status',
              ' c.image ',  ' c.imageUrl ','c.videoUrl','c.video', ' c.price ', 'c.id_cat', 'c.id_user',{author: ' u.name '}, {phone: ' u.telefone '})

              .whereRaw('?? = ??',[ 'c.id_user','u.id'])
              .where('c.deleteAt','=',false)
              .where('c.profissional','=',true)
              .where('c.status','=',true)
              .where('c.id_cat','=', req.params.id)
              .orderBy('c.id','asc')
              .then(courses => res.json(courses))
              .catch(err => res.status(500).send(err))
   }
   const getByCoursesNProfissional = async (req,res) => {
    app.db({c: ' courses ', u: 'users',ca:'categories'})
          .select(' c.id ', ' c.name ', ' c.desccurta ','c.desclonga','c.req ',
          {id_cat:'ca.id'},{category:'ca.name'},'c.status',
          'c.studing', ' c.image ',  ' c.imageUrl ','c.video', ' c.price ','c.videoUrl', 'c.id_cat','c.id_user', {author: ' u.name '}, {phone: ' u.telefone '})
          .whereRaw('?? = ??',[ 'c.id_user','u.id'])
          .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
          .where('c.deleteAt','=',false)
          .where('c.profissional','=' ,false)
          .orderBy('c.id','asc')
          .then(courses => res.json(courses))
          .catch(err => res.status(500).send(err))
}
const getByCoursesProfissional = async (req,res) => {
  app.db({c: ' courses ', u: 'users',ca:'categories'})
        .select(' c.id ', ' c.name ', ' c.desccurta ','c.desclonga','c.req ',
        {id_cat:'ca.id'},{category:'ca.name'},'c.status',
        'c.studing','c.imageUrl','c.image', ' c.price ','c.videoUrl','c.video', 'c.id_cat','c.id_user', {author: ' u.name '}, {phone: ' u.telefone '})
        .whereRaw('?? = ??',[ 'c.id_user','u.id'])
        .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
        .where('c.deleteAt','=',false)
        .where('c.profissional','=',true)
        .where('c.status','=',true)
        .where('u.id','=',req.params.id)
        .orderBy('c.id','asc')
        .then(courses => res.json(courses))
        .catch(err => res.status(500).send(err))
}
    return { save,saveEdit , removeAt , getById ,getByCoursesProfissional,getByCourseName,edit,
      get, getByCategory, getByCourses,getByCourseAllInformation,getTotalCourseTeacher,
      getByCoursesCategories,getByCoursesNProfissional,getByCourseStatsFalseAllInformation,
      getByIdTeacher,uploads,uploadsImage,getByIdCourseAllInformation,getTotalCourse,getByCourseTeacherAllInformation }
}
