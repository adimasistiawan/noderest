'use strict';
const Pengumuman= require('./pengumuman.controller');
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
router.post('/create', checkToken,Pengumuman.insertPengumuman)
router.get('/',checkToken, Pengumuman.getpengumuman)
router.get('/:id',checkToken, Pengumuman.getpengumumanById)
router.post('/update/:id',checkToken, Pengumuman.updatePengumuman)
router.get('/delete/:id',checkToken, Pengumuman.deletePengumuman)

module.exports = router