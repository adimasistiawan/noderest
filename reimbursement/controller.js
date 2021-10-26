'use strict'
const Reimbursement = require('./service')
const joi = require('../middlewares/validatebody')
const fs = require('fs')
module.exports = {
    createReimbursement: async (req,res)=>{
        const body = req.body
        const file = req.file == undefined? null:req.file.filename
        console.log(req)
        try {
            let validate = await joi.createReimbursementSchema.validateAsync(body)
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }
        const id = req.user.id
        Reimbursement.insert(id,file,body,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    getAll:(req,res)=>{
        const dari = req.params.dari
        const sampai = req.params.sampai
        const kode = req.params.kode
        console.log(kode)
        Reimbursement.get(dari,sampai,kode,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    getById:(req,res)=>{
        const id = req.params.id
        const user_status = req.user.status
        Reimbursement.getById(id,user_status,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    getByUser:(req,res)=>{
        const id = req.user.id
        const dari = req.params.dari
        const sampai = req.params.sampai
        const kode = req.params.kode
        Reimbursement.getByUser(id,dari,sampai,kode,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    getHistory:(req,res)=>{
        const id = req.params.id
        const dari = req.params.dari
        const sampai = req.params.sampai
        const kode = req.params.kode
        Reimbursement.getHistory(id,dari,sampai,kode,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    delete:(req,res)=>{
        const id = req.params.id
        Reimbursement.delete(id,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },
    // delete:(req,res)=>{
    //     const id = req.params.id
    //     Reimbursement.delete(id,(err,results)=>{
    //         if(err){
    //             return res.status(500).json({
    //                 success:0,
    //                 message:"connection error"
    //             })
    //         }
    //         return res.status(200).json({
    //             success:1,
    //             data:results
    //         });
    //     })
    // },
    updateStatus:async(req,res)=>{
        const body = req.body
        try {
            let validate = await joi.updateReimbursementSchema.validateAsync(body,{allowUnknown:true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }

        const id = req.params.id
        Reimbursement.updateStatus(id,body,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        })
    },

    update: async (req,res)=>{
        const body = req.body
        const file = req.file == undefined? null:req.file.filename
        const id = req.params.id
        const user_status = req.user.status
        console.log(file == null)
        Reimbursement.getById(id,user_status,(err,results)=>{
            if(err){
                return res.status(500).json({
                    success:0,
                    message:"connection error"
                })
            }
            if(file!=null){
                fs.unlink("./uploads/reimbursement/"+results.bukti_pembayaran, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');  
                                               
                    }
                });
            }
            
            Reimbursement.update(id,file,body,(err2,results2)=>{
                if(err2){
                    console.log(err2)
                    return res.status(500).json({
                        success:0,
                        message:"connection error"
                    })
                }
                return res.status(200).json({
                    success:1,
                    data:results2
                });
            })      
        })
    },
}