'use strict'

const conn = require('../connection')
const helper = require('../helper');
module.exports = {
    insert: (id,file,data, callback)=>{
        var datetime = new Date();
        var kode = helper.makeid(10);
        conn.query(`insert into reimbursement(kode,user_id,tanggal_pengajuan,keterangan,bukti_pembayaran,nominal,status) values(?,?,?,?,?,?,?)`,
        [kode,id,datetime,data.keterangan,file,data.nominal,"Belum Dikonfirmasi"],
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
            `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id order by reimbursement.tanggal_pengajuan desc`,
            [],
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.id = ?`,
                [id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    if(result[0]['status'] == "Telah Diterima"){
                        conn.query(
                            `update reimbursement set dilihat = 1 where id = ?`,
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
            conn.query(
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.id = ?`,
                [id, id],
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
            `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ?`,
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
            `delete from reimbursement where id = ?`,
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
                `update reimbursement set status = ?, tanggal_konfirmasi = ? where id = ?`,
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
                `update reimbursement set status = ?, tanggal_konfirmasi = ?, alasan_ditolak = ? where id = ?`,
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
            `select count(id) from reimbursement where status = 'Belum Dikonfirmasi'`,
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
            `select count(id) from reimbursement where status != 'Belum Dikonfirmasi' and dilihat = 0`,
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
}