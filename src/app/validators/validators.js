/* Validação para rotas */

const { Joi, Segments, celebrate } = require('celebrate')

module.exports = {

    validateUsers: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required().min(3),
            email: Joi.string().required().email(),
            telefone: Joi.string().required().min(8),
            password: Joi.string().required().min(6)
        })
    }),

    validateAuth: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(6)
        })
    }),

    validateLostPassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required().email(),
        })
    }),

    validateResetPassword: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(6),
            passwordResetToken: Joi.string().required()
        })
    }),
}