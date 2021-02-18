'use strict'

const conn = require('../connection')

module.exports = {
    insert: (id,file,data, callback)=>{
        conn.query(`insert into cuti(user_id,tanggal_pengajuan,dari,sampai,alasan,file,status) values(?,?,?,?,?,?,?)`,
        [id,data.tanggal_pengajuan,data.dari,data.sampai,data.alasan,file,"Belum Dikonfirmasi"],
        (error,result,fields)=>{
            if(error){
                console.log(error)
                return callback(error)
            }
            return callback(null,result)
        })
    }
}