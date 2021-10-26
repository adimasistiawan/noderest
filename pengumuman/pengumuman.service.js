'use strict';

const conn = require('../connection')

module.exports = {
    get: (callback)=>{
        conn.query(
            'select * from pengumuman order by id desc',
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
          
        conn.query(
            `insert into pengumuman (judul,isi,tanggal) values(?,?,?)`,
            [data.judul, data.isi, formattedDate],
            (error, results, fields) =>{
                if(error){
                    console.log(formattedDate)
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