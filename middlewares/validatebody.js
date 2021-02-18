const joi = require('@hapi/joi')

module.exports = {
    registerSchema: joi.object({
        email: joi.string().email().required(),
        nama: joi.required(),
        password: joi.string().min(8).required(),
        alamat: joi.string().required(),
        no_hp: joi.string().required(),
    }),
    updateUserSchema: joi.object({
        email: joi.string().email().required(),
        nama: joi.required(),
        alamat: joi.string().required(),
        no_hp: joi.string().required(),
    }),
    createCutiSchema: joi.object({
        tanggal_pengajuan: joi.date().required(),
        dari: joi.date().required(),
        sampai: joi.date().required(),
        alasan: joi.string().required(),
    })
}