const admin = require('../config/admin')
const teacher = require('../config/teacher')
const multer = require('multer')
const multerConfigUser = require('./multerUser')
const multerConfigArticle = require('./multerArtigosImage')
const multerConfigVideo = require('./multerAulas')
const multerConfigConteudo = require('./multerConteudo')
const multerConfigBanco = require('./multerBanco')
const multerConfigLibImage= require('./multerLibImage')
const multerConfigLibFicheiro = require('./multerLibFicheiro')
const multerConfigConteudoImage= require('./multerImageConteudo')
const multerConfigPagamentoPlano = require('./multerPagamentoPlano')
const multerConfigPagamentoVenda = require('./multerPagamentoVenda')
const multerConfigCourseImage = require('./multerCourseImage')
const multerConfigCourseVideo = require('./multerCourseVideo')

module.exports = app =>{
      app.post('/signup',app.api.user.save)
      app.post('/signin',app.api.auth.signin)
      app.post('/validateToken',app.api.auth.validateToken)

      app.route('/users')
            .all(app.config.passport.authenticate())
            .post(admin(app.api.user.save))
            .get(admin (app.api.user.get))

      app.route('/users/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.user.save)
            .get(app.api.user.getById)

      app.route('/user/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.user.getUserComplete)

      app.route('/userss/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.user.edit)

  /*   app.route('/start-upload-user/:bucket')
            .all(app.config.passport.authenticate())
            .get(app.api.user.startUploads)
*/
      /*app.route('/get-upload-url-user/:bucket')
            .all(app.config.passport.authenticate())
            .get(app.api.user.getUpload)

      app.route('/complete-upload-user/:bucket')
          .all(app.config.passport.authenticate())
            .post(app.api.user.completeUploads)
*/
      app.route('/password/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.user.editPassword)

      app.route('/students')
            .all(app.config.passport.authenticate())
            .get(admin(app.api.user.getByAluno))

      app.route('/teachers')
            .all(app.config.passport.authenticate())
            .get(admin(app.api.user.getByTeacher))

      app.route('/teacherss/:id')
              .all(app.config.passport.authenticate())
              .get(app.api.teacher.getByIdTeacher)

      app.route('/teachers')
            .all(app.config.passport.authenticate())
            .post(app.api.teacher.save)
            .get(admin(app.api.teacher.get))

      app.route('/users-admin')
              .all(app.config.passport.authenticate())
              .get(admin(app.api.user.getUserCompleteTeacher))

      app.route('/users-estudent')
              .all(app.config.passport.authenticate())
              .get(admin(app.api.user.getUserCompleteEstudent))

      app.route('/teachers/:id')
             .all(app.config.passport.authenticate())
              .put(app.api.teacher.save)
              .get(app.api.teacher.getById)

      app.route('/categorias')
              .get(app.api.category.getCategorias)

    app.route('/categorias/articles')
              .get(app.api.category. getCategoriasArticle)
  app.route('/categories/conteudos')
              .get(app.api.category.getCategoriasConteudos)
  app.route('/categories/livros')
        .get(app.api.category.getCategoriasLivros)

app.route('/categories/course')
        .get(app.api.category.getCategoriasCourse)


      app.route('/categories/course').get(app.api.category.get)
      app.route('/categories/course/:id')
            .get(app.api.category.getCategoryPath)

   app.route('/categories')
              .all(app.config.passport.authenticate())
              .post(teacher(app.api.category.save))
              .get(app.api.category.get)
    app.route('/categories/course-single')
              .get(app.api.category.get)

      app.route('/categories/tree')
            .get(app.api.category.getTree)

      app.route('/categorias/:name')
              .get(app.api.category.getByCategory)

      app.route('/categories/:id')
              .all(app.config.passport.authenticate())
              .put(teacher( app.api.category.save))
              .get( app.api.category.getById)
              .delete(teacher(app.api.category.remove))

      app.route('/category/:id')
              .all(app.config.passport.authenticate())
             .put(teacher( app.api.category.removeAt ))

      app.route('/courses')
           .all(app.config.passport.authenticate())
            .post(teacher(app.api.course.save ))
            .get(app.api.course.get)

      app.route('/courses/:id')
            .all(app.config.passport.authenticate())
            .put(teacher( app.api.course.save ))
            .get(teacher(app.api.course.getByIdTeacher))

      app.route('/coursess/:id')
            .get(app.api.course.getById)

     app.route('/curso/:id')
            .get(app.api.course.getByIdCourseAllInformation)
      app.route('/course-total')
            .get(app.api.course.getTotalCourse)
      app.route('/course-total-estudent-true/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.itensvenda.getByCourseEstudent)

      app.route('/course-total-estudent-false/:id')
           // .all(app.config.passport.authenticate())
            .get(app.api.itensvenda.getByCourseEstudentFalse)

      app.route('/course-total-teacher/:id')
            .all(app.config.passport.authenticate())
            .get(teacher(app.api.course.getTotalCourseTeacher))

      app.route('/course-todos')
            .all(app.config.passport.authenticate())
            .get(admin(app.api.course.getByCourseStatsFalseAllInformation))

      app.route('/course-todos/:id')
            .all(app.config.passport.authenticate())
            .get(teacher(app.api.course.getByCourseTeacherAllInformation))

      app.route('/edit-course/:id')
            .all(app.config.passport.authenticate())
            .put(admin(app.api.course.edit))


      app.route('/total-users-course/:id')
            //.all(app.config.passport.authenticate())
            .get(app.api.itensvenda.getTotalUsersCourse)

      app.route('/course/:id')
            .all(app.config.passport.authenticate())
            .put(teacher(app.api.course.removeAt))
// Uploads de arquivos estáticos no servidor podem ser mudados para o AWS
    //app.route('/upload').post(multer(multerConfig).single('file'),app.api.course.uploads)
    app.route('/upload/course/image/:id').post(multer(multerConfigCourseImage).single('file'),app.api.course.uploadsImage)
    app.route('/upload/course/video/:id').post(multer(multerConfigCourseVideo).single('file'),app.api.course.uploads)
    app.route('/upload/article/image/:id').post(multer(multerConfigArticle).single('file'),app.api.article.uploadsImagem)
    app.route('/upload/article/file/:id').post(multer(multerConfigArticle).single('file'),app.api.article.uploads)
    app.route('/upload/aula/module/:id').post(multer(multerConfigVideo).single('file'),app.api.lesson.uploads)
    app.route('/upload/conteudo/image/:id').post(multer(multerConfigConteudoImage).single('file'),app.api.conteudo.uploadsImage)
    app.route('/upload/conteudo/ficheiro/:id').post(multer(multerConfigConteudo).single('file'),app.api.conteudo.uploads)
    app.route('/upload/banco/:id').post(multer(multerConfigBanco).single('file'),app.api.banco.uploads)
    app.route('/upload/lib/image/:id').post(multer(multerConfigLibImage).single('file'),app.api.biblioteca.uploadsImage)
    app.route('/upload/lib/ficheiro/:id').post(multer(multerConfigLibFicheiro).single('file'),app.api.biblioteca.uploads)
    app.route('/upload/pagamento/venda/:id').post(multer(multerConfigPagamentoVenda).single('file'),app.api.pagamentosvendas.uploads)
    app.route('/upload/pagamento/plano/:id').post(multer(multerConfigPagamentoPlano).single('file'),app.api.pagamentosplano.uploads)
    app.route('/upload/user/image/:id').post(multer(multerConfigUser).single('file'),app.api.user.uploads)


    /*app.route('/start-upload/:bucket')
          .get(app.api.course.startUploads)

    app.route('/get-upload-url/:bucket')
          .get(app.api.course.getUpload)


    app.route('/complete-upload/:bucket')
          .post(app.api.course.completeUploads)
*/
    app.route('/courses/:id/categories')
            .get(app.api.course.getByCoursesCategories)

      app.route('/cursos')
               .get(app.api.course.getByCourses)

      app.route('/courses/search/:id')
               .get(app.api.course.getByCourseName)

    app.route('/course-admin')
          .get(app.api.course.getByCourseAllInformation)



    app.route('/course-profissional/:id')
            .all(app.config.passport.authenticate())
          .get(app.api.course.getByCoursesProfissional)

    app.route('/course-nprofissional')
          .get(app.api.course.getByCoursesNProfissional)

    app.route('/articles')
    .all(app.config.passport.authenticate())
    .get(teacher(app.api.article.get))
    .post(teacher(app.api.article.save))

app.route('/articles/:id')
.all(app.config.passport.authenticate())
    .get(app.api.article.getById)
    .put(teacher(app.api.article.save))
    .delete(teacher(app.api.article.remove))

  app.route('/articles-category/:id')
      .get(app.api.article.getByArticlesCategories)

    app.route('/article/:id')
    .all(app.config.passport.authenticate())
    .get(teacher(app.api.article.getByIdTeacher))
    .put(teacher(app.api.article.removeAt))

    app.route('/total-articles-teacher/:id')
          .get(app.api.article.getTotalArticlesTeacher)

app.route('/categories/:id/articles')
    .all(app.config.passport.authenticate())
    .get(app.api.article.getByCategory)

      app.route('/modulos')
            .all(app.config.passport.authenticate())
            .post(teacher( app.api.modulo.save ))
            .get(teacher( app.api.modulo.get))

      app.route('/modulos/:id')
            .all(app.config.passport.authenticate())
            .put(teacher( app.api.modulo.save ))
            .get(teacher( app.api.modulo.getById ))

      app.route('/modulo/:id')
             .all(app.config.passport.authenticate())
            .put( teacher( app.api.modulo.removeAt ))

      app.route('/modulo-course/:id')
                .get(app.api.modulo.getByModuloCourse)

      app.route('/modulo-pages/:id/modulos')
              .get(app.api.modulo.getModulePage)

      app.route('/lessons')
            .all(app.config.passport.authenticate())
            .post( teacher( app.api.lesson.save ))
            .get(teacher(app.api.lesson.get))

      app.route('/lessons/:id')
           .all(app.config.passport.authenticate())
            .put(teacher( app.api.lesson.save ))
            .get(teacher( app.api.lesson.getById ))

      app.route('/lesson-course/:id')
            .get(app.api.lesson.getByLessonCourses)

      app.route('/lesson-modulo/:id')
            .get(app.api.lesson.getByLessonModulo)

      app.route('/lesson/:id')
            .all(app.config.passport.authenticate())
            .put( teacher( app.api.lesson.removeAt))
            .get(teacher(app.api.lesson.getByLesson ))

      app.route('/lesson-all')
            .all(app.config.passport.authenticate())
            .get(teacher(app.api.lesson.getByLessonAll))

     /* app.route('/start-upload-lesson/:bucket')
            //.all(app.config.passport.authenticate())
            .get(app.api.lesson.startUploads)

      app.route('/get-upload-url-lesson/:bucket')
           // .all(app.config.passport.authenticate())
            .get(app.api.lesson.getUpload)

      app.route('/complete-upload-lesson/:bucket')
         // .all(app.config.passport.authenticate())
            .post(app.api.lesson.completeUploads)
*/
      app.route('/vendas')
           // .all(app.config.passport.authenticate())
            .post(app.api.venda.save)
            .get(app.api.venda.get)

      app.route('/vendas/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.venda.save)
            .get(app.api.venda.getById)

    app.route('/editarVenda/:id')
          .all(app.config.passport.authenticate())
          .put(admin(app.api.venda.editarVenda))

      app.route('/venda/:id')
             .all(app.config.passport.authenticate())
            .put(app.api.venda.removeAt)
            .get(app.api.venda.getByVenda)

      app.route('/vendas/usuario/:id')
            //.all(app.config.passport.authenticate())
            .get(app.api.venda.getVendaPorUsuario)

      app.route('/inscritos-course/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getEstudentIscritos)

      app.route('/inscritos-course-total/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getTotalEsdunt)

      app.route('/venda-user-true/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getVendaUserTrue)

      app.route('/venda-user-false/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getVendaUserFalse)

      app.route('/itens-venda-user-true/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getItvVendaUserTrue)

      app.route('/itens-venda-user-false/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getItvVendaUserFalse)


     app.route('/vendas-adm')
            .all(app.config.passport.authenticate())
            .get(admin(app.api.venda.getVendasAdmClientes))

      app.route('/vendas-adm/:id')
            .all(app.config.passport.authenticate())
            .get(admin(app.api.venda.getVendasAdm))

     app.route('/inscritos-course/:id/:idVenda/:data/:status')
            .all(app.config.passport.authenticate())
            .get(app.api.venda.getEstudentIscritosDataSem)

     app.route('/course-venda/:id/:idVenda/:status')
            //.all(app.config.passport.authenticate())
            .get(app.api.venda.getEstudentIscritosData)

    /*  app.route('/stats')
            .all(app.config.passport.authenticate())
            .get(app.api.stats.get)*/

      app.route('/itens-venda')
            //.all(app.config.passport.authenticate())
            .post(app.api.itensvenda.save)
            .get(app.api.itensvenda.get)


        app.route('/course-inscrito-teacher/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.itensvenda.getCoursesSelected)

      app.route('/itens-venda/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.itensvenda.save)
            .get(app.api.itensvenda.getById)

    app.route('/itens-vendas/:id')
          .all(app.config.passport.authenticate())
          .get(app.api.itensvenda.getByItensVenda)

    app.route('/itens-vendas/:id')
          .all(app.config.passport.authenticate())
          .put(app.api.itensvenda.removeAt)

    app.route('/course-see/:id')
            .get(app.api.itensvenda.getByCourseSee)

    app.route('/course-see/categories/category')
            .get(app.api.itensvenda.getByCategories)

    app.route('/coment-lesson')
        .all(app.config.passport.authenticate())
        .post(app.api.comentslesson.save)
        .get(app.api.comentslesson.get)

  app.route('/coment-lesson/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.comentslesson.save)
        .get(app.api.comentslesson.getById)
        .delete(app.api.comentslesson.remove)

  app.route('/coment-lessons/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.comentslesson.removeAt)
        .get(app.api.comentslesson.getByComentsLesson)

  app.route('/coments-users/:id')
       .all(app.config.passport.authenticate())
        .get(app.api.comentslesson.getByComentsUser)

app.route('/coments-lessons/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comentslesson.getByComents)

//comentario curso
app.route('/coment-course')
        .all(app.config.passport.authenticate())
        .post(app.api.comentscourse.save)
        .get(app.api.comentscourse.get)

  app.route('/coment-course/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.comentscourse.save)
        .get(app.api.comentscourse.getById)

  app.route('/coment-courses/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.comentscourse.removeAt)
        .get(app.api.comentscourse.getByComentsCourse)
        .delete(app.api.comentscourse.remove)


  app.route('/coments-course-users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comentscourse.getByComentsUser)

app.route('/coments-courses/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.comentslesson.getByComents)

app.route('/comentar-course/:id')
      .get(app.api.comentscourse.getByComentsPage)

  app.route('/bancos')
          .all(app.config.passport.authenticate())
          .post(app.api.banco.save)

    app.route('/bancos/:id')
          .all(app.config.passport.authenticate())
          .put(app.api.banco.save)
          .get(app.api.banco.getById)
          .delete(app.api.banco.remove)

    app.route('/bancos-user/:id')
            .all(app.config.passport.authenticate())
            .get(app.api.banco.get)

    /*  app.route('/start-upload-banco/:bucket')
           // .all(app.config.passport.authenticate())
            .get(app.api.banco.startUploads)
      app.route('/get-upload-url-banco/:bucket')
            //.all(app.config.passport.authenticate())
            .get(app.api.banco.getUpload)
      app.route('/complete-upload-banco/:bucket')
          //.all(app.config.passport.authenticate())
            .post(app.api.banco.completeUploads)
*/
    // rotas do  Bookar + Universidade
    //rotas da disciplina
    app.route('/cadeiras')
         // .all(app.config.passport.authenticate())
          .post(app.api.cadeira.save)
          .get(app.api.cadeira.get)

    app.route('/cadeiras/:id')
          .all(app.config.passport.authenticate())
          .put(teacher(app.api.cadeira.save))
          .get(teacher(app.api.cadeira.getById))

    app.route('/cadeira-remove/:id')
          .all(app.config.passport.authenticate())
          .put(teacher(app.api.cadeira.removeAt))

          app.route('/cadeira-search-course/:id')
          .all(app.config.passport.authenticate())
          .get(teacher(app.api.cadeira.getCadeiraPorCurso))

    app.route('/cadeira-search-categories/:id')
          .all(app.config.passport.authenticate())
          .get(teacher(app.api.cadeira.getConteudosPorCategorias))
// rota dos conteúdos
    app.route('/conteudos')
          .all(app.config.passport.authenticate())
          .post(teacher(app.api.conteudo.save))
          .get((app.api.conteudo.get))

  app.route('/conteudos/get')
          .get(app.api.conteudo.getSearch)

   app.route('/conteudos/all/:id')
          .get(app.api.conteudo.get)

  app.route('/conteudo-search/:id')
          .get(app.api.conteudo.getByIdSingleSearch)

    app.route('/conteudos/:id')
          .all(app.config.passport.authenticate())
          .put(teacher(app.api.conteudo.save))
          .get(teacher(app.api.conteudo.getById))

  app.route('/conteudos/:id/single')
        .get(app.api.conteudo.getByIdSingle)

    app.route('/content-user/:id')
          .all(app.config.passport.authenticate())
          .get(teacher(app.api.conteudo.getContentUser))

    app.route('/conteudos-remove/:id')
          .all(app.config.passport.authenticate())
          .put(teacher(app.api.conteudo.removeAt))

  /* app.route('/start-upload-conteudo/:bucket')
          //.all(app.config.passport.authenticate())
          .get(app.api.conteudo.startUploads)

    app.route('/get-upload-url-conteudo/:bucket')
          //.all(app.config.passport.authenticate())
          .get(app.api.conteudo.getUpload)

    app.route('/complete-upload-conteudo/:bucket')
        //.all(app.config.passport.authenticate())
          .post(app.api.conteudo.completeUploads)
*/
    app.route('/conteudo-search-course/:id')
          .all(app.config.passport.authenticate())
          .get(teacher(app.api.conteudo.getConteudosPorCurso))

    app.route('/conteudo-search-disciplina/:id')
          .all(app.config.passport.authenticate())
          .get(teacher(app.api.conteudo.getConteudosPorDisciplina))

      app.route('/total-conteudo').get(app.api.conteudo.totalConteudo)

    app.route('/config-conteudo')
          .all(app.config.passport.authenticate())
          .post(app.api.configconteudo.save)

    app.route('/config-conteudo/:id')
         .all(app.config.passport.authenticate())
          .put(app.api.configconteudo.save)
          .get(app.api.configconteudo.get)

    app.route('/config-conteudo-user/:id_user/:id')
          .all(app.config.passport.authenticate())
          .get(app.api.configconteudo.getUser)
//comentario Conteúdo
      app.route('/coment-conteudos')
            .all(app.config.passport.authenticate())
            .post(app.api.comentsconteudo.save)
            .get(app.api.comentsconteudo.get)

app.route('/coment-conteudos/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.comentsconteudo.save)
            .get(app.api.comentsconteudo.getById)

app.route('/coment-conteudo/:id')
            .all(app.config.passport.authenticate())
            .put(app.api.comentsconteudo.removeAt)
            .get(app.api.comentsconteudo.getByComentsLivro)
            .delete(app.api.comentsconteudo.remove)

app.route('/coments-conteudo/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.comentsconteudo.getByComents)

app.route('/comentar-conteudo/:id')
      .get(app.api.comentsconteudo.getByComentsPage)
// plano

    // biblioteca
app.route('/bibliotecas')
      //.all(app.config.passport.authenticate())
      .post((app.api.biblioteca.save))
// gets

app.route('/bibliotecas/:id')
      .all(app.config.passport.authenticate())
      .put(teacher(app.api.biblioteca.save))

app.route('/bibliotecas-id/:id')
      .get(app.api.biblioteca.getById)

app.route('/biblioteca-search')
        .get(app.api.biblioteca.get)

/*app.route('/start-upload-biblioteca/:bucket')
         // .all(app.config.passport.authenticate())
          .get(app.api.biblioteca.startUploads)

    app.route('/get-upload-url-biblioteca/:bucket')
         // .all(app.config.passport.authenticate())
          .get(app.api.biblioteca.getUpload)

    app.route('/complete-upload-biblioteca/:bucket')
        //.all(app.config.passport.authenticate())
        .post(app.api.biblioteca.completeUploads)
*/
  app.route('/biblioteca-search/:id')
        .get(app.api.biblioteca.getByBibliotecaName)

  app.route('/biblioteca-remove/:id')
        .all(app.config.passport.authenticate())
        .put(teacher(app.api.biblioteca.removeAt))

  app.route('/biblioteca-search-user/:id')
       // .all(app.config.passport.authenticate())
        .get(app.api.biblioteca.getBibliotecaPorUsuario)

 app.route('/biblioteca/:id/categories')
      .get(app.api.biblioteca.getBibliotecaPorCategories)

  app.route('/total-books-tecaher/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.biblioteca.getTotalBooksTeacher)

  app.route('/config-biblioteca')
        .all(app.config.passport.authenticate())
        .post(app.api.configbiblioteca.save)

  app.route('/config-biblioteca/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.configbiblioteca.save)
        .get(app.api.configbiblioteca.get)

    app.route('/config-biblioteca-user/:id_user/:id')
               .all(app.config.passport.authenticate())
                  .get(app.api.configbiblioteca.getUser)

//comentario livro
app.route('/coment-livro')
.all(app.config.passport.authenticate())
.post(app.api.comentslivro.save)
.get(app.api.comentslivro.get)

app.route('/coment-livro/:id')
.all(app.config.passport.authenticate())
.put(app.api.comentslivro.save)
.get(app.api.comentslivro.getById)

app.route('/coment-livros/:id')
//.all(app.config.passport.authenticate())
.put(app.api.comentslivro.removeAt)
.get(app.api.comentslivro.getByComentsLivro)
.delete(app.api.comentslivro.remove)

app.route('/coments-livros/:id')
//.all(app.config.passport.authenticate())
.get(app.api.comentslivro.getByComents)

app.route('/comentar-livro/:id')
.get(app.api.comentslivro.getByComentsPage)
// plano

app.route('/planos')
      .all(app.config.passport.authenticate())
      .post(app.api.planoestudo.save)
      .get(app.api.planoestudo.get)
// gets

app.route('/planos/:id')

      .put(app.api.planoestudo.save)
      .get(app.api.planoestudo.getById)

app.route('/planos-search/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.planoestudo.getPlano)

app.route('/plano-remove/:id')
      .all(app.config.passport.authenticate())
      .put(teacher(app.api.planoestudo.removeAt))

app.route('/plano-search-user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.planoestudo.getPlanoPorUsuario)

// itens plano
app.route('/itens-plano')
      .all(app.config.passport.authenticate())
      .post(app.api.itensplano.save)
      .get(app.api.itensplano.get)
// gets

app.route('/itens-plano/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.itensplano.save)
      .get(app.api.itensplano.getById)
      .delete(app.api.itensplano.remove)

app.route('/itens-plano-search/:id')
    //  .all(app.config.passport.authenticate())
      .get(app.api.itensplano.getItpPlanoPorPlanos)

app.route('/itens-plano-remove/:id')
      .all(app.config.passport.authenticate())
      .put(teacher(app.api.itensplano.removeAt))

app.route('/itens-plano-verificar/:id/:id_itp')
      .all(app.config.passport.authenticate())
      .get(app.api.itensplano.getItpPlanoVerificacao)
app.route('/itens-plano-all/:id')
      .get(app.api.itensplano.getItpPlanoPorPlanosAll)

app.route('/itens-plano-search-user/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.itensplano.getItpPlanoPorUsuario)

      // router itens venda biblioteca

      app.route('/itens-venda-biblioteca')
      .all(app.config.passport.authenticate())
      .post(app.api.itensbiblioteca.save)
      .get(app.api.itensbiblioteca.get)

app.route('/itens-venda-biblioteca/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.itensbiblioteca.save)
      .get(app.api.itensbiblioteca.getById)

app.route('/itens-vendas-biblioteca/:id')
    .all(app.config.passport.authenticate())
    .get(app.api.itensbiblioteca.getByItensVenda)

app.route('/itens-vendas-biblioteca/:id')
    .all(app.config.passport.authenticate())
    .put(app.api.itensbiblioteca.removeAt)

// router itens Biblioteca
app.route('/itens-plano-biblioteca')
      .all(app.config.passport.authenticate())
      .post(app.api.itensplanobiblioteca.save)
      .get(app.api.itensplanobiblioteca.get)

app.route('/itens-plano-biblioteca/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.itensplanobiblioteca.save)
      .get(app.api.itensplanobiblioteca.getById)
      .delete(app.api.itensplanobiblioteca.remove)

app.route('/itens-plano-biblioteca-search/:id')
      //.all(app.config.passport.authenticate())
      .get(app.api.itensplanobiblioteca.getItpPlanoPorPlanos)

app.route('/itens-plano-biblioteca-remove/:id')
      .all(app.config.passport.authenticate())
      .put(teacher(app.api.itensplanobiblioteca.removeAt))

app.route('/itens-plano-biblioteca-all/:id')
      .get(app.api.itensplanobiblioteca.getItpBibliotecaPorPlanosAll)

app.route('/itens-plano-biblioteca-search-user/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.itensplanobiblioteca.getItpPlanoPorUsuario)

app.route('/itens-plano-biblioteca-verificar/:id/:id_itp')
      .get(app.api.itensplanobiblioteca.getItpPlanoVerificacao)
      // fim


// visualizacao
app.route('/visualizacoes')
.all(app.config.passport.authenticate())
.post(app.api.visualizacao.save)
.get(app.api.visualizacao.get)
// gets

app.route('/visualizacoes/:id')
.all(app.config.passport.authenticate())
.put(app.api.visualizacao.save)
.get(app.api.visualizacao.getById)

app.route('/visualizacoes-search-user/:id')
.all(app.config.passport.authenticate())
.get(teacher(app.api.visualizacao.getVisualizacaoPorUsuarioAgrupadoData))

app.route('/visualizacoes-search-conteudo/:id')
.all(app.config.passport.authenticate())
.get(teacher(app.api.visualizacao.getVisualizacaoPorConteudoAgrupadoData))

app.route('/visualizacoes-search-conteudos/:id')
.all(app.config.passport.authenticate())
.get(teacher(app.api.visualizacao.getVisualizacaoPorConteudoAgrupadoMes))

app.route('/visualizacoes-search-users/:id')
.all(app.config.passport.authenticate())
.get(teacher(app.api.visualizacao.getVisualizacaoPorUsuarioAgrupadoMes))

app.route('/visualizacoes-remove/:id')
.all(app.config.passport.authenticate())
.put(teacher(app.api.visualizacao.removeAt))


// Pacote bookar +
app.route('/packages')
      .all(app.config.passport.authenticate())
      .post(admin(app.api.plano.save))

  app.route('/packagees')
        .get(app.api.plano.get)

app.route('/packagess')
      .all(app.config.passport.authenticate())
      .get(app.api.plano.getPackage)

app.route('/packages/:id')
      .all(app.config.passport.authenticate())
      .put(admin(app.api.plano.save))
      .get(app.api.plano.getById)

app.route('/packages-remove/:id')
      .all(app.config.passport.authenticate())
      .put(admin(app.api.plano.removeAt))

app.route('/packages-assinado')
      .all(app.config.passport.authenticate())
      .get(admin(app.api.plano.getPlanosAssinado))

// Assinar Pacote bookar +
app.route('/assinar-packages')
      .all(app.config.passport.authenticate())
      .post(app.api.assinar.save)
      .get(app.api.assinar.get)

app.route('/assinar-packages/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.assinar.save)
      .get(app.api.assinar.getById)

app.route('/assinar-packages-remove/:id')
      .all(app.config.passport.authenticate())
      .put(teacher(app.api.assinar.removeAt))

 app.route('/assinar-packages-user/:id')
      .all(app.config.passport.authenticate())
      .get(admin(app.api.assinar.getPlanoPorUsuario))

app.route('/assinar-packages-planos/:id')
      .all(app.config.passport.authenticate())
      .get(admin(app.api.assinar.getUsuarioPorPlano))


// pagamentos para os cursos e Livros
  app.route('/pagamentos-venda')
      .all(app.config.passport.authenticate())
      .post(app.api.pagamentosvendas.save)
      .get(app.api.pagamentosvendas.get)

  app.route('/pagamentos-venda/:id')
      .all(app.config.passport.authenticate())
      .post(app.api.pagamentosvendas.save)
      .get(app.api.pagamentosvendas.getById)

  app.route('/pagamentos-venda-user/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.pagamentosvendas.getPagamentosPorUsuario)

  app.route('/pagamentos/venda/user/:id_user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.pagamentosvendas.getPagamentosPorUsuarioEVenda)

/*app.route('/start-upload-pagamentosvendas/:bucket')
//.all(app.config.passport.authenticate())
.get(app.api.pagamentosvendas.startUploads)

app.route('/get-upload-url-pagamentosvendas/:bucket')
//.all(app.config.passport.authenticate())
.get(app.api.pagamentosvendas.getUpload)

app.route('/complete-upload-pagamentosvendas/:bucket')
//.all(app.config.passport.authenticate())
.post(app.api.pagamentosvendas.completeUploads)
*/
  app.route('/pagamentos-venda-admin')
      //.all(app.config.passport.authenticate())
      .get(app.api.pagamentosvendas.getPagamentosVendas)

  app.route('/pagamentos-remove/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.pagamentosvendas.removeAt)

  app.route('/pagamentos-venda-editar/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.pagamentosvendas.saveEdit))

// pagamentos para os planos
app.route('/pagamentos-plano')
      .all(app.config.passport.authenticate())
      .post(app.api.pagamentosplano.save)
      .get(app.api.pagamentosplano.get)

app.route('/alterar-status-plano-user/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.pagamentosplano.saveEdit))

 /* app.route('/start-upload-pagamentosplano/:bucket')
        //.all(app.config.passport.authenticate())
        .get(app.api.pagamentosplano.startUploads)

        app.route('/get-upload-url-pagamentosplano/:bucket')
        //.all(app.config.passport.authenticate())
        .get(app.api.pagamentosplano.getUpload)

        app.route('/complete-upload-pagamentosplano/:bucket')
        //.all(app.config.passport.authenticate())
        .post(app.api.pagamentosplano.completeUploads)
*/
app.route('/pagamentos-plano/:id')
      .all(app.config.passport.authenticate())
      .post(app.api.pagamentosplano.save)
      .get(app.api.pagamentosplano.getById)

app.route('/pagamentos-plano-user/:id')
      .all(app.config.passport.authenticate())
      .get(app.api.pagamentosplano.getPagamentosPorUsuario)

app.route('/pagamentos-planos')
      .all(app.config.passport.authenticate())
      .get(app.api.pagamentosplano.getPagamentosPlano)

app.route('/pagamentos-planos-remove/:id')
      .all(app.config.passport.authenticate())
      .put(app.api.pagamentosvendas.removeAt)

}
