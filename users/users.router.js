'use strict';
const { insertUser, getUsers, getUsersById, login, updateUser, deleteUser, getCurrentUser, homeAdmin, homePegawai, updateProfile, updateProfilePegawai } = require('./users.controller');
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
router.post('/create', checkToken,insertUser)
router.get('/profile',checkToken, getCurrentUser)
router.post('/profile/update/:id',checkToken, updateProfile)
router.post('/profile/update-pegawai/:id',checkToken, updateProfilePegawai)
router.get('/',checkToken, getUsers)
router.get('/home',checkToken, homeAdmin)
router.get('/home-pegawai',checkToken, homePegawai)
router.get('/:id',checkToken, getUsersById)
router.post('/update/:id',checkToken, updateUser)
router.get('/delete/:id',checkToken, deleteUser)

router.post('/login', login)

module.exports = router