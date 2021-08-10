'use strict'

const conn = require('../connection')
const helper = require('../helper');
module.exports = {
    insert: (id,data, callback)=>{
        var datetime = new Date();
        var kode = helper.makeid(10);
        conn.query(`insert into cuti(kode,user_id,tanggal_pengajuan,dari,sampai,alasan,status) values(?,?,?,?,?,?,?)`,
        [kode,id,datetime,data.dari,data.sampai,data.alasan,"Belum Dikonfirmasi"],
        (error,result,fields)=>{
            if(error){
                console.log(error)
                return callback(error)
            }
            return callback(null,result)
        })
    },
    get:(callback)=>{
        conn.query(
            `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id order by tanggal_pengajuan desc`,
            
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
    getById:(id,user_status,callback)=>{
        if(user_status == 'pegawai'){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.id = ?`,
                [id],
                (error, result, fields)=>{
                    
                    if(error){
                        return callback(error)
                    }
                    if(result[0]['status'] == 'Telah Diterima'){
                        conn.query(
                            `update cuti set dilihat = 1 where id = ?`,
                            [id],
                            (errors, results, fields)=>{
                                if(errors){
                                    return callback(errors)
                                }
                            }
                        );
                    }
                    return callback(null,result[0])
                }
            );
        }else{
            console.log(result)
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.id = ?`,
                [id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result[0])
                }
            );
        }
        
    },
    getByUser:(id,callback)=>{
        conn.query(
            `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ?`,
            [id],
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
    delete:(id,callback)=>{
        conn.query(
            `delete from cuti where id = ?`,
            [id],
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
    updateStatus:(id,data,callback)=>{
        console.log(data)
        var datetime = new Date();
        if(data.alasan_ditolak == ''){
            conn.query(
                `update cuti set status = ?, tanggal_konfirmasi = ? where id = ?`,
                [data.status,datetime,id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }else{
            conn.query(
                `update cuti set status = ?, tanggal_konfirmasi = ?, alasan_ditolak = ? where id = ?`,
                [data.status,datetime,data.alasan_ditolak,id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }
        
    },

    getNotConfirm:(callback)=>{
        conn.query(
            `select count(id) from cuti where status = 'Belum Dikonfirmasi'`,
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },

    getConfirm:(callback)=>{
        conn.query(
            `select count(id) from cuti where status != 'Belum Dikonfirmasi' and dilihat = 0`,
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
}