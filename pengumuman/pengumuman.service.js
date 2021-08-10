'use strict';

const conn = require('../connection')

module.exports = {
    get: (callback)=>{
        conn.query(
            'select * from pengumuman order by tanggal desc',
            [],
            (err, results)=>{
                if(err){
                    return callback(err)
                }
                return callback(null, results)
            }
        )
    },

    getById: (data,callback)=>{
        conn.query(
            'select * from pengumuman where id = ?',
            [data.id],
            (err, results)=>{
                console.log(err)
                if(err){
                    return callback(err)
                }
                return callback(null, results[0])
            }
        )
    },
    insert: (data, callback)=>{
        var datetime = new Date();
        conn.query(
            `insert into pengumuman (judul,isi,tanggal) values(?,?,?)`,
            [data.judul, data.isi, datetime],
            (error, results, fields) =>{
                if(error){
                    return callback(error)
                }
                return callback(null, results)
            }
        )
    },
    update: (params, data, callback)=>{
        conn.query(
            `update pengumuman set judul=?, isi=? where id = ?`,
            [data.judul, data.isi, params.id],
            (error, results, fields) =>{
                if(error){
                    return callback(error)
                }
                return callback(null, results)
            }
        )
    },
    delete: (data,callback)=>{
        conn.query(
            'delete from pengumuman where id = ?',
            [data.id],
            (err, results)=>{
                console.log(err)
                if(err){
                    return callback(err)
                }
                return callback(null, results)
            }
        )
    },
}