const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.view = async (req, res) => {
    const post = await Post.findOne({slug:req.params.slug})
    res.render('view', {post})
}

exports.add = (req, res) => {
    res.render('postAdd') 
}

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t=>t.trim())
    req.body.author = req.user._id
    const post = new Post(req.body)

    try{
        await post.save() 
    } catch(error) {
        req.flash('error','Ocorreu um erro, tente novamente mais tarde!') 
        return res.redirect('/post/add')
    }
    req.flash('success', 'Post adicionado com sucesso')
    //redirecionar para o home
    res.redirect('/')
    
}

exports.edit = async (req, res) => {
    //pegar as informações
    const post = await Post.findOne({slug:req.params.slug})
    //carregar o formulário
    res.render('postEdit', {post})
}

exports.editAction = async (req, res) => {
    req.body.slug = require('slug')(req.body.title, {lower:true})
    req.body.tags = req.body.tags.split(',').map(t=>t.trim())
    //procurar o item enviado
    //pegar os dados e atualizar
    try {
    const post = await Post.findOneAndUpdate(
        {slug:req.params.slug},
         req.body,
        {
            new:true, //retorna o novo item atualizado
            runValidators:true // roda as validações
        }
    )
    } catch(error) {
        req.flash('error','Ocorreu um erro, tente novamente mais tarde!')
        return res.redirect('/post/'+req.params.slug+'/edit') 
    }
    //mostrar mensagem de sucesso
    req.flash('success', 'Atualização feita com sucesso')
    //redirecionar para o home
    res.redirect('/')
}