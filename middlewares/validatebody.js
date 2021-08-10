const joi = require('@hapi/joi')

module.exports = {
    registerSchema: joi.object().keys({
        email: joi.string().email().required(),
        nama: joi.required(),
        password: joi.string().min(8).required(),
        alamat: joi.string().required(),
        no_hp: joi.string().required(),
    }),
    updateUserSchema: joi.object().keys({
        email: joi.string().email().required(),
        nama: joi.required(),
        alamat: joi.string().required(),
        no_hp: joi.string().required(),
    }),
    createCutiSchema: joi.object().keys({
        dari: joi.date().required(),
        sampai: joi.date().required(),
        alasan: joi.string().required(),
    }),
    createReimbursementSchema: joi.object().keys({
        nominal: joi.string().required(),
        keterangan: joi.string().required(),
    }),
    updateReimbursementSchema: joi.object().keys({
        status: joi.string().required(),
    }),
    updateCutiSchema: joi.object().keys({
        status: joi.string().required(),
    }),
    createPengumumanSchema: joi.object().keys({
        isi: joi.string().required(),
        judul: joi.string().required(),
    }),
    updatePengumumanSchema: joi.object().keys({
        isi: joi.string().required(),
        judul: joi.string().required(),
    })
}