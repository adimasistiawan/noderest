'use strict';

const conn = require('../connection')

module.exports = {
    get: (callback)=>{
        conn.query(
            'select * from users',
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
                return callback(null, results)
            }
        )
    },
    insert: (data, callback)=>{
        conn.query(
            `insert into users (nama,email,password) values(?,?,?)`,[data.nama, data.email, data.password],
            (error, results, fields) =>{
                if(error){
                    return callback(error)
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