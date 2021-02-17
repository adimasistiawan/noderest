'use strict';

const conn = require('../connection')

module.exports = {
    get: (callback)=>{
        conn.query(
            'select * from users where status = "pegawai"',
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
            'select * from users where id = ?',
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
        conn.query(
            `insert into users (nama,email,password,alamat,no_hp,status) values(?,?,?,?,?,?)`,
            [data.nama, data.email, data.password,data.alamat, data.no_hp, 'pegawai'],
            (error, results, fields) =>{
                if(error){
                    return callback(error)
                }
                return callback(null, results)
            }
        )
    },
    update: (params, data, callback)=>{
        
        if(data.password != ''){
            conn.query(
                `update users set nama=?, email=?, password=?, alamat=?, no_hp=? where id = ?`,
                [data.nama, data.email, data.password,data.alamat, data.no_hp, params.id],
                (error, results, fields) =>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null, results)
                }
            )
        }else{
            console.log("2")
            conn.query(
                `update users set nama = ?, email = ?, alamat = ?, no_hp = ? where id = ?`,
                [data.nama, data.email,data.alamat, data.no_hp, params.id],
                (error, results, fields) =>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null, results)
                }
            )
        }
        
    },
    delete: (data,callback)=>{
        console.log("dsd")
        conn.query(
            'delete from users where id = ?',
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
    getUserByEmail: (data, callback)=>{
        conn.query(
            `select * from users where email = ?`,
            [data],
            (error, results, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null, results[0])
            }
        )
    }
}