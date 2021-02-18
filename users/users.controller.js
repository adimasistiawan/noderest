'use strict';
const User = require('./users.service')
const {genSaltSync, hashSync, compareSync} = require('bcrypt')
const  Jwt = require('jsonwebtoken')
const joi = require('../middlewares/validatebody')


module.exports = {
    getUsers:(req, res)=>{
        User.get((err, results)=>{
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
        User.getById(params,(err, results)=>{
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
        let validate = joi.registerSchema.validateAsync(body)
        validate.catch((err)=>{
            return res.status(422).json({
                success:0,
                message:err.details[0].message
            })
        })
        console.log(body)
        const salt = genSaltSync(10)
        body.password = hashSync(body.password, salt)
        
        User.getUserByEmail(body.email,(err, results)=>{
            if(results){
                return res.status(409).json({
                    success:0,
                    message:"Email sudah pernah digunakan"
                })
            }else{
                User.insert(body,(err, results)=>{
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
            }
        })
        
    },
    updateUser: (req, res)=>{
        const body = req.body
        let validate = joi.updateUserSchema.validateAsync(body)
        validate.catch((err)=>{
            return res.status(422).json({
                success:0,
                message:err.details[0].message
            })
        })

        const params = req.params
        console.log(body)
        const salt = genSaltSync(10)
        
        if(body.password != ''){
            body.password = hashSync(body.password, salt)
        }
        User.getById(params,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            if(results.email == body.email){
                User.update(params,body,(err, results)=>{
                    if(err){
                        return res.status(500).json({
                            success:0,
                            message:err
                        })
                    }
                    return res.status(200).json({
                        success:1,
                        data: results
                    })
                })
            }else{
                User.getUserByEmail(body.email,(err, results)=>{
                    if(results){
                        return res.status(409).json({
                            success:0,
                            message:"Email sudah pernah digunakan"
                        })
                    }else{
                        User.update(params,body,(err, results)=>{
                            if(err){
                                return res.status(500).json({
                                    success:0,
                                    message:err
                                })
                            }
                            return res.status(200).json({
                                success:1,
                                data: results
                            })
                        })
                    }
                })
            }
        })
        
    },
    deleteUser: (req,res)=>{
        const params = req.params
        User.delete(params,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:err
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
        User.getUserByEmail(body.email,(err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            if(results == undefined){
                return res.status(500).json({
                    success:0,
                    message:"Invalid email or password"
                })
            }
            console.log(results)
            if(compareSync(body.password, results.password)){
                const token = Jwt.sign({result:results},'1234')
                return res.json({
                    success:1,
                    message:"success",
                    token:token
                });
                
            }else{
                return res.status(500).json({
                    success:0,
                    message:"Invalid email or password"
                })
            }
        })
    },
    getCurrentUser: (req,res)=>{
        
        console.log(req.user.id)
        return res.json({
            success:1,
            message:"success",
            data:req.user
        });
        
    }
}