'use strict'

const conn = require('../connection')
const helper = require('../helper');
module.exports = {
    insert: (id,file,data, callback)=>{
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
          
        var kode = "R"+helper.makeid(4);
        conn.query(`insert into reimbursement(kode,user_id,tanggal_pengajuan,keterangan,bukti_pembayaran,nominal,status) values(?,?,?,?,?,?,?)`,
        [kode,id,formattedDate,data.keterangan,file,data.nominal,"Belum Dikonfirmasi"],
        (error,result,fields)=>{
            if(error){
                console.log(error)
                return callback(error)
            }
            return callback(null,result)
        })
    },
    get:(dari,sampai,kode,callback)=>{
        if(dari == "null" && kode == "null"){
            conn.query(
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where (reimbursement.tanggal_pengajuan between ? and ?) order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where (reimbursement.tanggal_pengajuan between ? and ?) and reimbursement.kode like ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.kode like ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id  where reimbursement.user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?) order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?) and reimbursement.kode like ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? and reimbursement.kode like ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.id = ?`,
                [id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    if(result[0]['status'] != "Belum Dikonfirmasi"){
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
    getByUser:(id,dari,sampai,kode,callback)=>{
        
        if(dari == "null" && kode == "null"){
            conn.query(
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id  where reimbursement.user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?) order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?) and reimbursement.kode like ? order by reimbursement.id desc`,
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
                `select reimbursement.*, user.nama from reimbursement inner join user on reimbursement.user_id = user.id where reimbursement.user_id = ? and reimbursement.kode like ? order by reimbursement.id desc`,
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
                `update reimbursement set status = ?, tanggal_konfirmasi = ? where id = ?`,
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
                `update reimbursement set status = ?, tanggal_konfirmasi = ?, alasan_ditolak = ? where id = ?`,
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

    update:(id,file,data,callback)=>{
        console.log(data)
        if(file == null){
            conn.query(
                `update reimbursement set keterangan = ?, nominal = ? where id = ?`,
                [data.keterangan,data.nominal,id],
                (error, result, fields)=>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null,result)
                }
            );
        }else{
            conn.query(
                `update reimbursement set bukti_pembayaran = ?, keterangan = ?, nominal = ? where id = ?`,
                [file,data.keterangan,data.nominal,id],
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

    getConfirm:(id,callback)=>{
        conn.query(
            `select count(id) from reimbursement where status != 'Belum Dikonfirmasi' and dilihat = 0 and user_id = ?`,
            [id],
            (error, result, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null,result)
            }
        );
    },

    getTotal:(id,callback)=>{
        var date = new Date();
        console.log(id)
        var firstDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var endDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        conn.query(
            `select sum(nominal) as total from reimbursement where status = 'Telah Diterima' and user_id = ?`,
            [id],
            (error, result, fields)=>{
                console.log(error)
                if(error){
                    return callback(error)
                }
                conn.query(
                    `select count(id) as telah_diterima from reimbursement where status = 'Telah Diterima' and user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?)`,
                    [id, firstDateOfCurrentMonth, endDateOfCurrentMonth],
                    (error2, result2, fields2)=>{
                        if(error2){
                            return callback(error2)
                        }
                        
                        conn.query(
                            `select count(id) as belum_dikonfirmasi from reimbursement where status = 'Belum Dikonfirmasi' and user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?)`,
                            [id, firstDateOfCurrentMonth, endDateOfCurrentMonth],
                            (error3, result3, fields3)=>{
                                if(error3){
                                    return callback(error3)
                                }
                                
                                conn.query(
                                    `select count(id) as ditolak from reimbursement where status = 'Ditolak' and user_id = ? and (reimbursement.tanggal_pengajuan between ? and ?)`,
                                    [id, firstDateOfCurrentMonth, endDateOfCurrentMonth],
                                    (error4, result4, fields4)=>{
                                        if(error4){
                                            return callback(error4)
                                        }
                                        var data = {
                                            'total':result[0]['total'],
                                            'telah_diterima':result2[0]['telah_diterima'],
                                            'belum_dikonfirmasi':result3[0]['belum_dikonfirmasi'],
                                            'ditolak':result4[0]['ditolak']
                                        }
                                        return callback(null,data)
                                    }
                                );
                            }
                        );
                    }
                );
                
            }
        );
    },
}