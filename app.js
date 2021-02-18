const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const userRouter = require('./users/users.router')
const cutiRouter = require('./cuti/cuti.router')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/users', userRouter)
app.use('/api/cuti', cutiRouter)

app.listen(5000,()=> console.log("node started"))