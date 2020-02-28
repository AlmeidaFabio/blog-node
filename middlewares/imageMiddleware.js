const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
    storage:multer.memoryStorage(), //salva na memoria
    fileFilter:(req, file, next)=>{ // filtros
        const allowed = ['image/jpeg', 'image/jpg', 'image/png']
        if(allowed.includes(file.mimetype)) {
            next(null, true)
        } else {
            next({message:'Arquivo não suportado'}, false)
        }
    }
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
    if(!req.file){ // verifica se existe um arquivo
        next()
        return
    }
    const ext = req.file.mimetype.split('/')[1] // pega a extensão do arquivo
    let filename = `${uuid.v4()}.${ext}` //gera o nome do arquivo
    req.body.photo = filename

    const photo = await jimp.read(req.file.buffer) //ler a imagem
    await photo.resize(800, jimp.AUTO) //redimensiona a imagem
    await photo.write(`./public/media/${filename}`) //escreve a imagem
    next()
}
