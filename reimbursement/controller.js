'use strict'
const Reimbursement = require('./service')
const joi = require('../middlewares/validatebody')

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
        Reimbursement.get((err,results)=>{
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
        Reimbursement.getByUser(id,(err,results)=>{
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
}