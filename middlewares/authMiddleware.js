exports.isLogged = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Ops! Você não tem permissão')
        res.redirect('/login')
        return
    }
    next()
}


exports.changePassword = (req, res) => {
    //confirmar que as senhas batem
    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Senhas não batem')
        res.redirect('/profile') 
        return
    }
    //procurar o usuario e trocar a senha dele
    req.user.setPassword(req.body.password, async () => {
        await req.user.save()

        req.flash('success', 'Senha alterada com sucesso')
        res.redirect('/')
    })
    //Redirecionar para a Home

}