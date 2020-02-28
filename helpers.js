exports.defaultPageTitle = "Padrão MVC no node"

exports.menu = [
    {name:'Home', slug:'/', guest:true, logged:true},
    {name:'Adicionar Post', slug:'/post/add', guest:false, logged:true},
    {name:'Cadastrar', slug:'/user/registro', guest:true, logged:false},
    {name:'Login', slug:'/login', guest:true, logged:false},
    {name:'Sair', slug:'/logout', guest:false, logged:true}
]