'use strict';
const Pengumuman = require('./pengumuman.service');
const joi = require('../middlewares/validatebody');


module.exports = {
    getpengumuman:(req, res)=>{
        Pengumuman.get((err, results)=>{
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
    getpengumumanById:(req, res)=>{
        const params = req.params
        Pengumuman.getById(params,(err, results)=>{
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
    insertPengumuman: async (req, res)=>{
        const body = req.body
        console.log(body)
        try {
            let validate = await joi.createPengumumanSchema.validateAsync(body,{allowUnknown:true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }
        
        Pengumuman.insert(body,(err, results)=>{
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
    updatePengumuman: async (req, res)=>{
        const body = req.body
        try {
            let validate = await joi.updatePengumumanSchema.validateAsync(body, { allowUnknown: true})
            
        } catch (error) {
            return res.status(403).json({
                success:0,
                message:error.details[0].message
            })
        }

        const params = req.params
        Pengumuman.update(params,body,(err, results)=>{
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
    deletePengumuman: (req,res)=>{
        const params = req.params
        Pengumuman.delete(params,(err, results)=>{
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
    
}