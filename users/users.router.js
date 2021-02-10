'use strict';
const { insertUser, getUsers, getUsersById, login } = require('./users.controller');
const router = require('express').Router()
const {checkToken} = require('../token_validation')
router.post('/create', checkToken,insertUser)
router.get('/',checkToken, getUsers)
router.get('/:id',checkToken, getUsersById)
router.post('/login', login)
module.exports = router