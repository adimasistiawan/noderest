'use strict'

const conn = require('../connection')
const helper = require('../helper');
const MOMENT = require( 'moment' );
module.exports = {
    insert: (id,data, callback)=>{
        var datetime = new Date().toLocaleString('en-GB', {
          },
          ).split(" ");

          // Now we can access our time at date[1], and monthdayyear @ date[0]
          var time = datetime[1];
          var mdy = datetime[0];
          
          // We then parse  the mdy into parts
          
          mdy = mdy.split('/');
          var day = parseInt(mdy[0]);
          var month = parseInt(mdy[1]);
          var year = parseInt(mdy[2]);
          
          // Putting it all together
          var formattedDate = year + '-' + month + '-' + day + ' ' + time;;
          
        //  datetime = MOMENT(datetime).format( 'YYYY-MM-DD  HH:mm:ss.000' );
        var kode = "C"+helper.makeid(4);
        conn.query(`insert into cuti(kode,user_id,tanggal_pengajuan,dari,sampai,alasan,status) values(?,?,?,?,?,?,?)`,
        [kode,id,formattedDate,data.dari,data.sampai,data.alasan,"Belum Dikonfirmasi"],
        (error,result,fields)=>{
            if(error){
                
                return callback(error)
            }
            return callback(null,result)
        })
    },
    get:(dari,sampai,kode,callback)=>{
        if(dari == "null" && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id order by cuti.tanggal_pengajuan desc`,
                [],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }else if(dari != "null"  && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where (cuti.tanggal_pengajuan between ? and ?) order by cuti.tanggal_pengajuan desc`,
                [dari,sampai],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari != "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where (cuti.tanggal_pengajuan between ? and ?) and cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [dari,sampai, kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari == "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
    },
    getHistory:(id,dari,sampai,kode,callback)=>{
        if(dari == "null" && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? order by cuti.tanggal_pengajuan desc`,
                [id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }else if(dari != "null"  && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id  where cuti.user_id = ? and (cuti.tanggal_pengajuan between ? and ?) order by cuti.tanggal_pengajuan desc`,
                [id,dari,sampai],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari != "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? and (cuti.tanggal_pengajuan between ? and ?) and cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [id, dari,sampai, kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari == "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? and cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [id,kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
    },
    getById:(id,user_status,callback)=>{
        if(user_status == 'staff'){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.id = ?`,
                [id],
                (error, result, fields)=>{
                    
                    if(error){
                        return callback(error)
                    }
                    if(result[0]['status'] != 'Belum Dikonfirmasi'){
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
    getByUser:(id,dari,sampai,kode,callback)=>{
     
        if(dari == "null" && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? order by cuti.tanggal_pengajuan desc`,
                [id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }else if(dari != "null"  && kode == "null"){
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id  where cuti.user_id = ? and (cuti.tanggal_pengajuan between ? and ?) order by cuti.tanggal_pengajuan desc`,
                [id,dari,sampai],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari != "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? and (cuti.tanggal_pengajuan between ? and ?) and cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [id, dari,sampai, kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
        else if(dari == "null"  && kode != "null"){
            kode = "%"+kode+"%";
            conn.query(
                `select cuti.*, user.nama from cuti inner join user on cuti.user_id = user.id where cuti.user_id = ? and cuti.kode like ? order by cuti.tanggal_pengajuan desc`,
                [id,kode],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    console.log(result)
                    return callback(null,result)
                }
            );
        }
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
        var datetime = new Date().toLocaleString('en-GB', {
        },
        ).split(" ");

          // Now we can access our time at date[1], and monthdayyear @ date[0]
          var time = datetime[1];
          var mdy = datetime[0];
          
          // We then parse  the mdy into parts
          mdy = mdy.split('/');
          var day = parseInt(mdy[0]);
          var month = parseInt(mdy[1]);
          var year = parseInt(mdy[2]);
          
          // Putting it all together
          var formattedDate = year + '-' + month + '-' + day + ' ' + time;;
          
        if(data.alasan_ditolak == ''){
            conn.query(
                `update cuti set status = ?, tanggal_konfirmasi = ? where id = ?`,
                [data.status,formattedDate,id],
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
                [data.status,formattedDate,data.alasan_ditolak,id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }
        
    },

    update:(id,data,callback)=>{
        console.log(data)
        conn.query(
            `update cuti set dari = ?, sampai = ?, alasan = ? where id = ?`,
            [data.dari,data.sampai,data.alasan,id],
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
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

    getConfirm:(id,callback)=>{
        console.log("inilo"+id)
        conn.query(
            `select count(id) from cuti where status != 'Belum Dikonfirmasi' and dilihat = 0 and user_id = ?`,
            [id],
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },
}