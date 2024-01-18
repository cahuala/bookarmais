const queries = require('./queries')
//const AWS = require('aws-sdk');
//const CONFIG = require('../config/config')
module.exports = app => {
/*  const s3 = new AWS.S3({
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

    const save = (req, res) => {
        const banco = { ...req.body }
        if(req.params.id) banco.id = req.params.id

        try {
            existsOrError(banco.banco, 'banco não informado')
            existsOrError(banco.nconta, 'Número da conta não informada')
            existsOrError(banco.iban, 'IBAN não informada')
            existsOrError(banco.docbanco, 'Documentos não informado')
            existsOrError(banco.bancourl, 'Documentos não informado')
            existsOrError(banco.id_user, 'Usuário não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(banco.id) {
            app.db('userbancos')
                .update(banco)
                .where({ id: banco.id })
                .returning('*')
               .then(banco=> res.json(banco).status(204))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('userbancos')
                .insert(banco)
                .returning('*')
               .then(banco=> res.json(banco).status(204))
                .catch(err => res.status(500).send(err))
        }
    }
    const remove = async (req, res) => {
      try {
          const rowsDeleted = await app.db('userbancos')
              .where({ id: req.params.id }).del()

          try {
              existsOrError(rowsDeleted, 'Banco não foi encontrado.')
          } catch(msg) {
              return res.status(400).send(msg)
          }

          res.status(204).send()
      } catch(msg) {
          res.status(500).send(msg)
      }
  }

    const limit = 10 // usado para paginação
    const get = async (req, res) => {
        app.db({b: ' userbancos ', u: 'users'})
        .select('b.id','b.banco',' b.nconta','b.iban','b.bancourl',{id_user:'u.id'},{name:'u.name'})
        .whereRaw('?? = ??',[ 'b.id_user','u.id'])
        .where('b.id_user','=',req.params.id)
            .then(bancos => res.json( bancos ))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('userbancos')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }
    const uploads = async (req,res)=>{
      const file = req.file
      const url = `${process.env.ENDERECO}/filesBanco/${req.params.id}/${file.filename}`
      res.json({file,url})
    }
 /*   const startUploads= async (req,res)=>{
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
     }
*/
    return { save, remove, get, getById,uploads }
}
