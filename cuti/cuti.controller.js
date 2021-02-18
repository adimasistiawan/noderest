'use strict'
const Cuti = require('./cuti.service')
const joi = require('../middlewares/validatebody')

module.exports = {
    createCuti: (req,res)=>{
        console.log(req.file)
        const body = req.body
        const file = req.file == undefined? null:req.file.filename

        let validate = joi.createCutiSchema.validateAsync(body)
        validate.catch((err)=>{
            return res.status(422).json({
                success:0,
                message:err.details[0].message
            })
        })
        const id = req.user.id
        Cuti.insert(id,file,body,(err,results)=>{
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
    }
}