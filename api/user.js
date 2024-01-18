const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { getTemplate, sendEmail } = require('../config/email')
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
  const { existsOrError, notExistsOrError,equalsOrError,isEmail } = app.api.validation

  const encryptPassword = password =>{
    const salt = bcrypt?.genSaltSync(10)
    return bcrypt.hashSync(password,salt)
  }
  const save =async (req,res)=>{
    const user = {...req.body }
    if(req.params.id) user.id=req.params.id
    try {

      existsOrError(user.name,'Nome não informado')
      existsOrError(user.email,'E-mail não informado')
      existsOrError(user.password,'Senha não informada')
      existsOrError(user.confirmPassword,'Confirmação de senha inválida')
      equalsOrError(user.password,user.confirmPassword,'Senhas não conferem')
      //isEmail(user.email,'E-mail não válido')


      const userFromDB =await app.db('users')
      .where({ email: user.email}).first()
      if(!user.id){
        notExistsOrError(userFromDB,'Usuário já cadastrado')
      }
    } catch (msg) {
      return res.status(400).send(msg)
    }
    user.password =encryptPassword(user.password)
    delete user.confirmPassword
    if(user.id){
      app.db('users').update(user)
      .where({ id: user.id})
      .returning('*')
      .then(user=>{ res.json(user).status(204) })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      //const template = getTemplate(user.name)
     // await sendEmail(user.email,'Confirmação da conta',template)
      app.db('users').insert(user)
      .returning('*')
      .then(user=>{ res.json(user).status(204) })
      .catch(err=>{res.status(500).send(err) })
    }
  }
  const edit =async (req,res)=>{
    const user = {...req.body }
    if(req.params.id) user.id=req.params.id
    if(user.id){
      app.db('users').update(user)
      .where({ id: user.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('users').insert(user)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }
  const editPassword= async (req,res)=>{
    const user = {...req.body }
    if(req.params.id) user.id=req.params.id
    try {
      existsOrError(user.password,'Senha não informada')
      existsOrError(user.passwordNew,'Nova Senha não Informada')
      existsOrError(user.confirmPassword,'Confirmação de senha inválida')
      equalsOrError(user.password,user.confirmPassword,'Senhas não conferem')

    } catch (msg) {
      return res.status(400).send(msg)
    }
    const users = await app.db('users').where({id:req.params.id}).first()
    if(!users) return res.status(400).send('Usuário não encontrado!')
    const isMatch = bcrypt.compareSync(req.body.password,users.password)
    if(!isMatch) return res.status(400).send('Senha inválida!')
      user.password =encryptPassword(req.body.passwordNew)
      delete user.confirmPassword
      if(user.id){
        app.db('users').update(user)
        .where({ id: user.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }
  }
  limit = 9
  const get= async (req,res)=>{
    app.db('users')
    .select('id' , 'name' , 'email' , 'teacher' , 'telefone' , 'watshapp' , 'endereco' ,'image','imageUrl','admin')
    .then(users=>res.json(users))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db('users')
    .where({id: req.params.id })
    .first()
    .then(user=>{res.json(user)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getUserComplete= (req,res)=>{
    app.db({u: 'users',t:'teachers'})
    .select('u.id','u. name','u.email','u.endereco','u.nota','u.image','u.imageUrl',
    't.course','t.nivel','t.experiencia','t.hability')
    .where('u.deleteAt','=', false )
    .whereRaw('?? = ??',[ 't.id_user','u.id'])
    .where('u.id','=', req.params.id)
    .first()
    .then(user=>{res.json(user)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getUserCompleteTeacher= (req,res)=>{
    app.db({u: 'users'})
    .select('u.id','u. name','u.email','u.endereco','u.nota','u.image','u.imageUrl')
    .where('u.deleteAt','=', false )
    .where('u.teacher','=',true)
    .where('u.admin','=',false)
    .then(user=>{res.json(user)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getUserCompleteEstudent= (req,res)=>{
    app.db({u: 'users'})
    .select('u.id','u. name','u.email','u.endereco','u.nota','u.image','u.imageUrl')
    .where('u.deleteAt','=', false )
    .where('u.teacher','=',false)
    .where('u.admin','=',false)
    .then(user=>{res.json(user)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByAluno= async(req,res)=>{
    const result = await app.db(' users ')
    .where({teacher: false })
    .where({admin: false })
    .count(' id ').first()
    const count = parseInt( result.count )
    app.db('users')
    .select('id' , 'name' , 'email' , 'teacher' , 'telefone' , 'watshapp' , 'endereco' , 'image','imageUrl')
    .where({teacher: false })
    .where({admin: false })
    .then(users=>res.json({users:users,count}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByTeacher= async (req,res)=>{
    const result = await app.db(' users ')
    .where({teacher: true})
    .where({admin: false })
    .count(' id ').first()
    const count = parseInt( result.count )

    app.db('users')
    .select('id' , 'name' , 'email' , 'teacher' , 'telefone' , 'watshapp' , 'endereco' , 'image','admin','imageUrl')
    .where({teacher: true})
    .where({admin: false })
    .then(users=>res.json({users:users,count}))
    .catch(err=>{ res.status(500).send(err)})
  }
  const uploads = async (req,res)=>{
    const file = req.file
    const url = `${process.env.ENDERECO}/image/user/${req.params.id}/${file.filename}`
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
  return { save , get, getById,getByAluno,getUserCompleteTeacher,
    getByTeacher,editPassword,edit,getUserComplete,uploads,getUserCompleteEstudent}
}
