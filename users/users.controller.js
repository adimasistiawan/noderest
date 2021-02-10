'use strict';
const { insert, get, getById, getUserByEmail } = require('./users.service')
const {genSaltSync, hashSync, compareSync} = require('bcrypt')
const { sign } = require('jsonwebtoken')

module.exports = {
    getUsers:(req, res)=>{
        get((err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data: results
            })
        })
    },
    getUsersById:(req, res)=>{
        const params = req.params
        console.log(params)
        getById(params,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data: results
            })
        })
    },
    insertUser: (req, res)=>{
        const body = req.body
        console.log(body)
        const salt = genSaltSync(10)
        body.password = hashSync(body.password, salt)
        insert(body,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data: results
            })
        })
    },
    login: (req, res)=>{
        const body = req.body;
        getUserByEmail(body.email,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            if(results == undefined){
                return res.status(200).json({
                    success:0,
                    message:"Invalid email or password"
                })
            }
            console.log(results)
            if(compareSync(body.password, results.password)){
                const jwt = sign({result:results},'1234',{
                    expiresIn: '1h'
                })
                return res.json({
                    success:1,
                    message:"success",
                    token:jwt
                });
            }else{
                return res.status(200).json({
                    success:0,
                    message:"Invalid email or password"
                })
            }
        })
    }
}