'use strict';
const User = require('./users.service')
const Cuti = require('../cuti/cuti.service')
const Pengumuman = require('../pengumuman/pengumuman.service')
const Reimbursement = require('../reimbursement/service')
const {genSaltSync, hashSync, compareSync} = require('bcrypt')
const  Jwt = require('jsonwebtoken')
const joi = require('../middlewares/validatebody');
const { options } = require('./users.router');


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
    insertUser: async (req, res)=>{
        const body = req.body
        
        
        try {
            let validate = await joi.registerSchema.validateAsync(body,{allowUnknown:true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }
        
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
    updateUser: async (req, res)=>{
        const body = req.body
        try {
            let validate = await joi.updateUserSchema.validateAsync(body, { allowUnknown: true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }

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
        return res.json({
            success:1,
            message:"success",
            data:req.user
        });
        
    },
    homeAdmin:(req, res)=>{
        var cuti = 0;
        var reimbursement = 0;
        Cuti.getNotConfirm((err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            cuti = results[0]['count(id)']
            Reimbursement.getNotConfirm((err2, results2)=>{
                if(err2){
                    return res.status(500).json({
                        success:0,
                        message:"connection error"
                    })
                }
                reimbursement = results2[0]['count(id)']
                return res.json({
                    success:1,
                    message:"success",
                    data:{
                        user: req.user,
                        reimbursement:reimbursement,
                        cuti:cuti,
                    }
                });
            })
        })
        
        console.log(cuti)
        
    },

    homePegawai:(req, res)=>{
        var cuti = 0;
        var reimbursement = 0;
        Cuti.getConfirm((err, results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            cuti = results[0]['count(id)']
            Reimbursement.getConfirm((err2, results2)=>{
                if(err2){
                    return res.status(500).json({
                        success:0,
                        message:"connection error"
                    })
                }
                reimbursement = results2[0]['count(id)']
                Pengumuman.get((err3, results3)=>{
                    if(err3){
                        return res.status(500).json({
                            success:0,
                            message:"connection error"
                        })
                    }
                    return res.json({
                        success:1,
                        message:"success",
                        data:{
                            user: req.user,
                            reimbursement:reimbursement,
                            cuti:cuti,
                            pengumuman:results3,
                        }
                    });
                })
            })
        })
    }
}