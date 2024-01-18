const bodyParser = require('body-parser')
const cors = require('cors')


module.exports = app =>{
          app.use(bodyParser.json())
          app.use(bodyParser.urlencoded({extended:true}))
          const corsOptions={
            origin:'*',
            optionsSuccessStatus:200
          };
         
          app.use(cors(corsOptions))
}
