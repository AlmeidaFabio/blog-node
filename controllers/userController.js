const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const mailHandler = require('../handlers/mailHandler')

exports.login = (req, res) => {
    res.render('./partials/login') 
} 

exports.loginAction = (req, res) => {
    const auth = User.authenticate()

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu email e/ou senha estão errados! '+error)
            res.redirect('/login')
            return
        }

        req.login(result, ()=>{})

        req.flash('success', 'Bem vindo, divirta-se!!')
        res.redirect('/') 
    })
}


exports.add = (req, res) => {
    res.render('./cadastro')
}

exports.addAction = async (req, res) => {
    const newUser = await new User(req.body)
    User.register(newUser, req.body.password, (error) =>{
        if(error) {
        req.flash('error', 'Ocorreu um erro tente mais tarde.')
        res.redirect('/user/registro')
        return
        }   
    })   
    req.flash('success', 'Cadastrado(a) com sucesso, seja bem vindo(a) '+newUser.username+', faça login!!')
    res.redirect('/login')     
}


exports.logout = (req, res) => {
    req.logout()
    res.redirect('/')
}


exports.profile = (req, res) => {
    res.render('profile')
}

exports.profileAction = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {_id:req.user._id},
            {username:req.body.username, email:req.user.email},
            {new:true, runValidators:true}
        )
    } catch(e) {
        req.flash('error', 'Ocorreu algum erro: '+e.message)
        res.redirect('/profile')
        return
    }
    req.flash('success', 'Dados atualizados com sucesso!')
    res.redirect('/profile')
}

exports.forget = (req, res) => {
    res.render('forget')
}

exports.forgetAction = async (req, res) => {
    //verificar se o usuario realmente existe
    const user = await User.findOne({email:req.body.email}).exec() 
    if(!user){
        req.flash('error', 'Email não cadastrado')
        res.redirect('/user/forget')
        return
    }
    //gerar um token com data de expiração e salvar no banco de dados
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000 //1hora
    await user.save()

    //enviar link
    const resetLink = `http://${req.headers.host}/user/reset/${user.resetPasswordToken}`

    const to = `${user.username} <${user.email}>`
    const html = `Testando email com link:<br/><a href="${resetLink}">Resetar sua senha</a>`
    const text = `Testando email com link: ${resetLink}`

    //enviar link via email para o usuario
    mailHandler.send({
        to,
        subject:'Resetar sua senha',
        html,
        text
    })

    req.flash('success', 'Enviamos um  email com as instruções ')
    res.redirect('/login')

    //usuario acessar o link e trocar a senha
}
  

exports.forgetToken = async (req, res) => {
    //verificar se o token é válido
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec()

    if(!user) {
        req.flash('error', 'Token expirado!')
        res.redirect('/user/forget')
        return
    }
    res.render('forgetPassword')
}


exports.forgetTokenAction = async (req, res) => {
     //verificar se o token é válido
     const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec()

    if(!user) {
        req.flash('error', 'Token expirado!')
        res.redirect('/user/forget')
        return 
    }

    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Senhas não batem')
        res.redirect('back') 
        return
    }
    //procurar o usuario e trocar a senha dele
    user.setPassword(req.body.password, async () => {
        await user.save()

        req.flash('success', 'Senha alterada com sucesso')
        res.redirect('/')
    })
}