const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
module.exports={
      //dest:path.resolve(__dirname,"..","tmp","banco"),
      storage: multer.diskStorage({
            destination:(req,file,cb)=>{
              const dir = path.resolve(__dirname,"..","tmp","banco",req.params.id)
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir,0744)
              }
              cb(null,dir)
            },
            filename:(req,file,cb)=>{
              crypto.randomBytes(16,(err,hash)=>{
                if(err) cb(err)

                const fileName =`${hash.toString('hex')}-${file.originalname}`
                cb(null,fileName)
              })
            }
      }),
      limits:{
        fileSize: 5*1024*1024,
      },
     /* fileFilter:(req,file,cb)=>{
            const allowedMimes=[
              "file/pdf",
              "image/jpeg",
              "image/pjpeg",
              "image/png",
              "image/gif",
              "file/pdf"
            ];
            if(allowedMimes.includes(file.mimetype)){
              cb(null,true)
            }else{
              cb(new Error('Arquivo com formato inválido'))
            }
      },*/
}


/*app.route('/upload').get(teacher(multer(multerConfig).single('file'),(req,res)=>{
  return res.json({hello:'ola Upload'})
}))
const multer = require('multer')
const multerConfig = require('./multer')

app.route('/upload').post(multipartMiddleware,teacher(app.api.course.uploads))

const multipartMiddleware = multipart({ uploadDir:'./uploads' })
*/
