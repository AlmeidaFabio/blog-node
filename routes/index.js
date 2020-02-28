const express = require('express')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

//middlewares
const imageMiddleware = require('../middlewares/imageMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

//Rotas
const router = express.Router()
router.get('/', homeController.index )

router.get('/user/registro', userController.add)
router.post('/user/registro', userController.addAction)
router.get('/login', userController.login)
router.post('/login', userController.loginAction)
router.get('/logout', userController.logout)
router.get('/profile', authMiddleware.isLogged, userController.profile)
router.post('/profile', authMiddleware.isLogged, userController.profileAction) 
router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword)
router.get('/user/forget', userController.forget)
router.post('/user/forget', userController.forgetAction)
router.get('/user/reset/:token', userController.forgetToken)
router.post('/user/reset/:token', userController.forgetTokenAction)

router.get('/post/add', authMiddleware.isLogged, postController.add)
router.post('/post/add',
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.addAction 
)

router.get('/post/:slug/edit', authMiddleware.isLogged, postController.edit)
router.post('/post/:slug/edit',
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.editAction  
)

router.get('/post/:slug', postController.view)

module.exports = router