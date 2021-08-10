'use strict'
const Cuti = require('./cuti.service')
const joi = require('../middlewares/validatebody')

module.exports = {
    createCuti: async (req,res)=>{
        const body = req.body
        console.log(body)
        try {
            let validate = await joi.createCutiSchema.validateAsync(body)
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }
        const id = req.user.id
        Cuti.insert(id,body,(err,results)=>{
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
        Cuti.get((err,results)=>{
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
    getCutiById:(req,res)=>{
        const id = req.params.id
        const user_status = req.user.status
        Cuti.getById(id,user_status,(err,results)=>{
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
    getCutiByUser:(req,res)=>{
        const id = req.user.id
        Cuti.getByUser(id,(err,results)=>{
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
    deleteCuti:(req,res)=>{
        const id = req.params.id
        Cuti.delete(id,(err,results)=>{
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
    updateCutiStatus:async(req,res)=>{
        const body = req.body
        try {
            let validate = await joi.updateCutiSchema.validateAsync(body,{allowUnknown:true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }

        const id = req.params.id
        Cuti.updateStatus(id,body,(err,results)=>{
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