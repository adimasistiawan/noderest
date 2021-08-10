const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const userRouter = require('./users/users.router')
const cutiRouter = require('./cuti/cuti.router')
const pengumumanRouter = require('./pengumuman/pengumuman.router')
const reimbursementRouter = require('./reimbursement/router.js')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/users', userRouter)
app.use('/api/cuti', cutiRouter)
app.use('/api/pengumuman', pengumumanRouter)
app.use('/api/reimbursement', reimbursementRouter)
app.use(express.static('uploads/cuti'));
app.use(express.static('uploads/reimbursement'));

app.listen(5000,()=> console.log("node started"))