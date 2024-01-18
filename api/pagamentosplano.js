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
      const pagPlano = {...req.body}
      if(req.params.id) pagPlano.id=req.params.id
      try {

        existsOrError(pagPlano.status,'estado não informado')
        existsOrError(pagPlano.data,'Data não informada')
        existsOrError(pagPlano.id_plano,'Plano não informado')
        existsOrError(pagPlano.id_user,'Usuário não informado')
      } catch (msg) {
        return res.status(400).send(msg)
      }
      if(pagPlano.id){
        app.db('pagamentos_plano').update(pagPlano)
        .where({ id: pagPlano.id})
        .returning('*')
      .then(pag=>{ res.json(pag).status(204) })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        app.db('pagamentos_plano').insert(pagPlano)
        .returning('*')
        .then(pag=>{ res.json(pag).status(204) })
        .catch(err=>{res.status(500).send(err) })
      }
    }
    const saveEdit =async (req,res)=>{
      const pagPlano = {
        id:req.params.id,
        status:req.body.status
        }
      if(req.params.id) pagPlano.id=req.params.id
      if(pagPlano.id){
        app.db('pagamentos_plano').update(pagPlano)
        .where({ id: pagPlano.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }
    }
    const removeAt =(req,res)=>{
        const pagPlano ={
          id:req.params.id
        }
        pagPlano.deleteAt=true
        if(req.params.id) pagPlano.id=req.params.id
        if(pagPlano.id){
          app.db('pagamentos_curso').update(pagPlano)
          .where({ id: pagPlano.id})
          .then(_=>{ res.status(204).send() })
          .catch(err=>{ res.status(500).send(err)})
        }else{
          existsOrError(pagPlano.deleteAt,'Código  não informdo')
        }

    }


    const get= (req,res)=>{
      app.db('pagamentos_plano')
      .where({deleteAt:false})
      .distinct()
      .then(pagamentos_curso=>{res.json(pagamentos_curso)})
      .catch(err=>{ res.status(500).send(err)})
    }
    const getPagamentosPorUsuario=(req,res)=>{
      app.db({p:'pagamentos_plano',u:'users',pl:'planos'})
      .select('p.id' , 'p.status','p.data','p.ficheiro','p.ficheiroUrl','pl.name',{valor:'pl.price'},{id_plano:'pl.id'},
      {id_user: 'u.id'},{user:'u.name'})
      .where('p.deleteAt','=',false)
      .where('u.id','=',req.params.id)
      .whereRaw('?? = ??',[ 'p.id_user','u.id'])
      .whereRaw('?? = ??',[ 'p.id_plano','pl.id'])
      .distinct()
      .then(pagamentos=>{res.json(pagamentos)})
      .catch(err=>{ res.status(500).send(err)})
    }
    const getPagamentosPlano=(req,res)=>{
      app.db({p:'pagamentos_plano',u:'users',pl:'planos'})
      .select('p.id' , 'p.status','p.data','p.ficheiro','p.ficheiroUrl','pl.name',{valor:'pl.price'},{id_plano:'pl.id'},
      {id_user: 'u.id'},{user:'u.name'})
      .where('p.deleteAt','=',false)
      .whereRaw('?? = ??',[ 'p.id_user','u.id'])
      .whereRaw('?? = ??',[ 'p.id_plano','pl.id'])
      .distinct()
      .then(pagamentos=>{res.json(pagamentos)})
      .catch(err=>{ res.status(500).send(err)})
    }
      const getById= (req,res)=>{
      app.db('pagamentos_plano')
      .where({deleteAt:false})
      .where({id: req.params.id })
      .first()
      .then(agendar_estudos=>{res.json(agendar_estudos)})
      .catch(err=>{ res.status(500).send(err)})
    }
    const uploads = async (req,res)=>{
      const file = req.file
      const url = `${process.env.ENDERECO}/pagamento/plano/${req.params.id}/${file.filename}`
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
    return { save , get,removeAt,getPagamentosPorUsuario,
      getById,getPagamentosPlano,uploads,saveEdit }
  }
