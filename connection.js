const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    database: 'pegawai',
    user:'root',
    password:'',
    connectTimeout:3000
})

conn.connect((err)=>{
    if(err) throw err
    console.log("Success")
})

module.exports = conn