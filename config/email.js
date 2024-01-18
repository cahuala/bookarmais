const nodemailer = require('nodemailer')
const SMTP_CONFIG = require("./smtp")

const transporter = nodemailer.createTransport({
  host:SMTP_CONFIG.host,
  port:SMTP_CONFIG.port,
  secure:false,
  auth:{
    user:SMTP_CONFIG.user,
    pass:SMTP_CONFIG.pass
  },
  tls:{
    rejectUnauthorized:false
  },
})
const sendEmail= async(email,subject,html)=>{
  try {
    await transporter.sendMail({
      from:`Bookar + <${SMTP_CONFIG.user} >`,
      to:email,
      subject,
      text:"Bookar +",
      html,
    })
  } catch (error) {
    console.log("Erro ao enviar o email",error)
  }
}
const getTemplate = (name)=>{
  return ` <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmação</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
      />
      <!-- Font Awesome -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/fontawesome-free/css/all.min.css"
      />
      <!-- Ionicons -->
      <link
        rel="stylesheet"
        href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
      />
      <!-- Tempusdominus Bootstrap 4 -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css"
      />
      <!-- iCheck -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/icheck-bootstrap/icheck-bootstrap.min.css"
      />
      <!-- JQVMap -->
      <link rel="stylesheet" href="../html/css-js/plugins/jqvmap/jqvmap.min.css" />
      <!-- Theme style -->
      <link rel="stylesheet" href="../html/css-js/dist/css/adminlte.min.css" />
      <!-- overlayScrollbars -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/overlayScrollbars/css/OverlayScrollbars.min.css"
      />
      <!-- Daterange picker -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/daterangepicker/daterangepicker.css"
      />
      <!-- summernote -->
      <link
        rel="stylesheet"
        href="../html/css-js/plugins/summernote/summernote-bs4.min.css"
      />
    </head>
    <body>
      <div class="container">
            <div class="row text-center">
                <div class="col-12 p-4 bg-dark">
                  <img src="./image/Bookar.png" width="250" alt="">
                    <h3>Obrigado por  registar-se ${name}</h3>
                    <p>Confirme a sua conta e use os nosso serviços</p>
                    <a class="btn-lg btn-success" href="">Confirmar conta </a>
                </div>
            </div>
      </div>
    </body>
  </html>
  `;
}
module.exports={
  sendEmail,getTemplate
}