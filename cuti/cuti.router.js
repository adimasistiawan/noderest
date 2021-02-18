'use strict'
const CutiController = require('./cuti.controller')
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        console.log(path.join(__dirname, "/uploads"))
        cb(null,"./uploads/cuti")
    },
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    }
})
const upload = multer({storage: storage})


router.post('/create',[checkToken,upload.single('file')],CutiController.createCuti)

module.exports = router