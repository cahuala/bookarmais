
module.exports = app=>{
  const { existsOrError, notExistsOrError,equalsOrError } = app.api.validation

  const save =async (req,res)=>{
    const teacher = {...req.body }
    if(req.params.id) teacher.id=req.params.id
    try {
      existsOrError(teacher.course,'Curso não informado')
      existsOrError(teacher.nivel,'Grau academico não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(teacher.id){
      app.db('teachers').update(teacher)
      .where({ id: teacher.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('teachers').insert(teacher)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }
  const get= (req,res)=>{
    app.db('teachers')
    .then(teachers=>{res.json(teachers)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db('teachers')
    .where({id: req.params.id })
    .first()
    .then(teacher=>{res.json(teacher)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByIdTeacher= (req,res)=>{
    app.db('teachers')
    .where({id_user: req.params.id })
    .first()
    .then(teacher=>{res.json(teacher)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getByTeacher=(req,res)=>{
    app.db('teachers')
    .where('name', 'like',`%${ req.params.name }%`)
    .then(teacher=>{res.json(teacher)})
    .catch(err=>{ res.status(500).send(err)})
  }
  return { save , get, getById,getByTeacher,getByIdTeacher}
}
