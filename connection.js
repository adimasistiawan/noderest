const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    database: 'reimbursement_app',
    user:'root',
    password:'',
    connectTimeout:3000,
    multipleStatements: true,
    timezone: 'Asia/Jakarta'
})

conn.connect((err)=>{
    if(err) throw err
    console.log("Success")
})

module.exports = conn