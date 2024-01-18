
module.exports = app=>{
  const { existsOrError, notExistsOrError } = app.api.validation

  const save =async (req,res)=>{
    const category = {
      id: req.body.id,
      name: req.body.name,
      parentId: req.body.parentId,
      data:req.body.data
  }
    if(req.params.id) category.id=req.params.id
    try {
      existsOrError(category.name,'Nome não informado')
    } catch (msg) {
      return res.status(400).send(msg)
    }
    if(category.id){
      app.db('categories').update(category)
      .where({ id: category.id})
      .then(_=>{ res.status(204).send() })
      .catch(err=>{ res.status(500).send(err)})
    }else{
      app.db('categories').insert(category)
      .then(_=>{ res.status(204).send() })
      .catch(err=>{res.status(500).send(err) })
    }
  }

  const remove = async(req,res) =>{
    try {
            existsOrError(req.params.id,'Código da categoria não informado')

            const subCategory = await app.db('categories')
            .where({parentId:req.params.id})
            notExistsOrError(subCategory,'Categoria possui subcategoria.')
            const course = await app.db('courses')
                    .where({id_cat:req.params.id})
            notExistsOrError(course,'Categoria possui cursos')
            const rowsDeleted = await app.db('categories')
                    .where({id:req.params.id}).del()
            existsOrError(rowsDeleted,'Categoria não foi encontrada')

            res.status(204).send()
    } catch (msg) {
          res.status(400).send(msg)
    }
  }

  const removeAt =(req,res)=>{
      const category ={
        id:req.params.id
      }
      category.deleteAt=true
      if(req.params.id) category.id=req.params.id
      if(category.id){
        app.db('categories').update(category)
        .where({ id: category.id})
        .then(_=>{ res.status(204).send() })
        .catch(err=>{ res.status(500).send(err)})
      }else{
        existsOrError(category.deleteAt,'Código da categoria não informdo')
      }

  }

  const withPath = categories =>{
        const getParent = (categories,parentId)=>{
              const parent = categories.filter(parent=> parent.id===parentId)
              return parent.length ? parent[0]: null
        }
        const categoriesWithPath = categories.map(category=>{
              let path = category.label
              let parent = getParent(categories,category.parentId)
              while(parent){
                path=`${parent.label} > ${path}`
                parent= getParent(categories,parent.parentId)
              }
              return {...category,path}
        })
        categoriesWithPath.sort((a,b)=>{
              if(a.path<b.path) return -1
              if(a.path>b.path) return 1
              return 0
        })
        return categoriesWithPath
  }
  const withPathSingle = (idCategory,categories) =>{
    //console.log(categories)
    const getParent = (categories,parentId)=>{
          const parent = categories.filter(parent=> parent.id===parentId)
          return parent.length ? parent[0]: null
    }
    const categoriesWithPath = categories.map(category=>{
        const id = parseInt(idCategory)
      if(id===category.id){
          let path = category.label
          let parent =getParent(categories,category.parentId)

          while(parent){

            path=`${parent.label} > ${path}`
            parent= getParent(categories,parent.parentId)
          }
          return {...category,path}
    }
  })
    categoriesWithPath.sort((a,b)=>{
          if(a.path<b.path) return -1
          if(a.path>b.path) return 1
          return 0
    })
    return categoriesWithPath
}
  const get= (req,res)=>{
    app.db('categories')
    .select('id' , 'name as label','parentId')
    .where({deleteAt:false})
    .distinct()
    .then(categories=>{res.json(withPath( categories))})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCategoryPath=(req,res)=>{
    app.db({ca:'categories',c:'courses'})
    .select('ca.id' , 'ca.name as label','ca.parentId',{course: 'c.id'})
    .where('ca.deleteAt','=',false)
    .where('c.id','=',req.params.id)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .distinct()
    .then(categories=>{res.json(withPath(categories))})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCategorias= (req,res)=>{
    app.db({ca:'categories',c:'courses'})
    .select('ca.id' , 'ca.name')
    .limit(7)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .where('ca.deleteAt','=',false)
    .where('c.deleteAt','=',false)
    .distinct()
    .then(categories=>{res.json(categories)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCategoriasLivros= (req,res)=>{
    app.db({ca:'categories',b:'biblioteca'})
    .select('ca.id' , 'ca.name')
    .limit(7)
    .whereRaw('?? = ??',[ 'b.id_cat','ca.id'])
    .where('ca.deleteAt','=',false)
    .where('b.deleteAt','=',false)
    .distinct()
    .then(categories=>{res.json(categories)})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getCategoriasCourse= (req,res)=>{
    app.db({ca:'categories',c:'courses'})
    .select('ca.id' , 'ca.name')
    .limit(7)
    .whereRaw('?? = ??',[ 'c.id_cat','ca.id'])
    .where('ca.deleteAt','=',false)
    .where('c.deleteAt','=',false)
    .where('c.profissional','=',true)
    .where('c.status','=',true)
    .distinct()
    .then(categories=>{res.json(categories)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCategoriasArticle= (req,res)=>{
    app.db({ca:'categories',a:'articles'})
    .select('ca.id' , 'ca.name')
    .limit(7)
    .whereRaw('?? = ??',[ 'a.categoryId','ca.id'])
    .where('ca.deleteAt','=',false)
    .where('a.deleteAt','=',false)
    .distinct()
    .then(categories=>{res.json(categories)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getCategoriasConteudos= (req,res)=>{
    app.db({ca:'categories',c:'courses',co:'conteudos',d:'cadeiras'})
    .select('ca.id', 'ca.name')
    .limit(7)
    .whereRaw('?? = ??',[ 'c.id','d.id_course'])
    .whereRaw('?? = ??',[ 'd.id','co.id_disc'])
    .whereRaw('?? = ??',[ 'ca.id','c.id_cat'])
    .where('ca.deleteAt','=',false)

    .distinct()
    .then(categories=>{res.json(categories)})
    .catch(err=>{ res.status(500).send(err)})
  }
  const getById= (req,res)=>{
    app.db('categories')
    .select('id' , 'name','parentId')
    .where({deleteAt:false})
    .where({id: req.params.id })
    .first()
    .then(teacher=>{res.json(teacher)})
    .catch(err=>{ res.status(500).send(err)})
  }

  const getByCategory=(req,res)=>{
    app.db('categories')
    .select('id' , 'name as label','parentId')
    .where({deleteAt:false})
    .then(categories=>{res.json(withPathSingle({id:req.params.id},categories))})
    .catch(err=>{ res.status(500).send(err)})
  }
  const toTree =(categories,tree)=>{
        if(!tree) tree=categories.filter(c=>!c.parentId)
        tree = tree.map(parentNode=>{
              const isChild =node=>node.parentId==parentNode.id
              parentNode.children= toTree(categories,categories.filter(isChild))
              return parentNode
        })
        return tree
  }
  const getTree=(req,res)=>{
        app.db('categories')
        .select('id','name as label','parentId')
        .then(categories=>res.json(toTree(withPath(categories))))
        .catch(err=>res.status(500).send(err))
  }
  return { save , get,remove,removeAt, getCategoriasConteudos,getCategoriasLivros,
    getById,getByCategory,getTree,getCategorias,getCategoriasCourse
    ,getCategoriasArticle,getCategoryPath }
}
