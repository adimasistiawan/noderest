'use strict';
const { insertUser, getUsers, getUsersById, login, updateUser, deleteUser, getCurrentUser } = require('./users.controller');
const router = require('express').Router()
const {checkToken} = require('../middlewares/token_validation')
router.post('/create', checkToken,insertUser)
router.get('/profile',checkToken, getCurrentUser)
router.get('/',checkToken, getUsers)
router.get('/:id',checkToken, getUsersById)
router.patch('/update/:id',checkToken, updateUser)
router.delete('/delete/:id',checkToken, deleteUser)
router.post('/login', login)

module.exports = router