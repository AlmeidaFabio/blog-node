const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.index = async (req, res)=>{
    //res.send('Hello World!')
    //res.json()
    let responseJson = {
        pageTitle:'', 
        posts:[],
        tags:[],
        tag:''
    }
    
    responseJson.tag = req.query.t

    const postFilter = (typeof responseJson.tag != 'undefined') ? {tags:responseJson.tag} : {}

    const tagsPromise = Post.getTagsList()
    const postsPromise = Post.find(postFilter).populate('author') 

    const [tags, posts] = await Promise.all([tagsPromise, postsPromise])

     for(let i in tags){
        if(tags[i]._id == responseJson.tag){
            tags[i].class = "selected"
        }
    }
    responseJson.tags = tags
    responseJson.posts = posts

    res.render('home', responseJson) 
}