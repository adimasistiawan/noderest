'use strict';

const { response } = require('express');
const conn = require('../connection')

module.exports = {
    get: (callback)=>{
        conn.query(
            'select * from user where status = "staff" order by id desc',
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
        console.log(data.id)
        conn.query(
            'select * from user where id = ?',
            [data.id],
            (err, results)=>{
                if(err){
                    return callback(err)
                }
                return callback(null, results[0])
            }
        )
    },
    insert: (data, callback)=>{
        conn.query(
            `insert into user (nama,email,password,alamat,no_hp,divisi,status) values(?,?,?,?,?,?,?)`,
            [data.nama, data.email, data.password,data.alamat, data.no_hp,data.divisi,'staff'],
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
                `update user set nama=?, email=?, password=?, alamat=?, no_hp=?, divisi=? where id = ?`,
                [data.nama, data.email, data.password,data.alamat, data.no_hp, data.divisi, params.id],
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
                `update user set nama = ?, email = ?, alamat = ?, no_hp = ?, divisi=? where id = ?`,
                [data.nama, data.email,data.alamat, data.no_hp, data.divisi, params.id],
                (error, results, fields) =>{
                    if(error){
                        return callback(error)
                    }
                    console.log(results)
                    return callback(null, results)
                }
            )
        }
        
    },
    updateProfilePegawai: (params, data, callback)=>{
        console.log("data")
        if(data.password != ''){
            conn.query(
                `update user set nama=?, email=?, password=?, alamat=?, no_hp=? where id = ?`,
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
                `update user set nama = ?, email = ?, alamat = ?, no_hp = ? where id = ?`,
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
    updateProfile: (params, data, callback)=>{
        
        if(data.password != ''){
            conn.query(
                `update user set nama=?, email=?, password=? where id = ?`,
                [data.nama, data.email, data.password, params.id],
                (error, results, fields) =>{
                    if(error){
                        return callback(error)
                    }
                    return callback(null, results)
                }
            )
        }else{
            conn.query(
                `update user set nama = ?, email = ? where id = ?`,
                [data.nama, data.email, params.id],
                (error, results, fields) =>{
                    if(error){
                        return callback(error)
                    }
                    console.log(results)
                    return callback(null, results)
                }
            )
        }
        
    },
    
    delete: (data,callback)=>{
        conn.query(
            'update user set dihapus = 1 where id = ?',
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
            `select * from user where email = ?`,
            [data],
            (error, results, fields)=>{
                if(error){
                    return callback(error)
                }
                return callback(null, results[0])
            }
        )
    },
}