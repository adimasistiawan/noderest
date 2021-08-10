'use strict'
const CutiController = require('./cuti.controller')
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
const path = require('path')
const multer = require('multer')
const cutiController = require('./cuti.controller')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        console.log(path.join(__dirname, "/uploads"))
        cb(null,"./uploads/cuti")
    },
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    },
    
})
const upload = multer({storage: storage, limits: { fileSize: 4 * 1024 * 1024}}).single('file')


// router.post('/create',[checkToken, function (req, res, next) {

//     upload(req, res, function (err) {
//         if (err) {
//             return res.status(422).json({
//                 success:0,
//                 message: err.message
//             });
//         }
//         next()
//     });

// }],CutiController.createCuti)
router.get('/',checkToken,cutiController.getAll)
router.post('/create',checkToken,cutiController.createCuti)
router.get('/:id',checkToken,cutiController.getCutiById)
router.get('/me',checkToken,cutiController.getCutiByUser)
router.post('/updatestatus/:id',checkToken,cutiController.updateCutiStatus)
module.exports = router