'use strict'
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
const path = require('path')
const multer = require('multer')
const reimbursementController = require('./controller')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        console.log(path.join(__dirname, "/uploads"))
        cb(null,"./uploads/reimbursement")
    },
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    },
    
})
const upload = multer({storage: storage, limits: { fileSize: 4 * 1024 * 1024}}).single('bukti_pembayaran')


router.post('/create',[checkToken, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(422).json({
                success:0,
                message: err.message
            });
        }
        next()
    });

}],reimbursementController.createReimbursement)
router.get('/me/:dari/:sampai/:kode',checkToken,reimbursementController.getByUser)
router.get('/history/:id/:dari/:sampai/:kode',checkToken,reimbursementController.getHistory)
router.get('/:id',checkToken,reimbursementController.getById)
router.get('/delete/:id',checkToken,reimbursementController.delete)
router.post('/updatestatus/:id',checkToken,reimbursementController.updateStatus)
router.post('/update/:id',[checkToken, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(422).json({
                success:0,
                message: err.message
            });
        }
        next()
    });

}],reimbursementController.update)
router.get('/:dari/:sampai/:kode',checkToken,reimbursementController.getAll)
module.exports = router