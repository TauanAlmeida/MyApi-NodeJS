const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth');
const crypto = require('crypto')
const mailer = require('../modules/mailer')

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

module.exports = {
    async getUserbyEmail(req, res){
        const { email } = req.body
        const user = await User.findOne({ email })
        
        if (user){
            return res.json({user})
        }
        return res.status(400).send({ error: "User not found"})
    },

    //GEMAIL
    async userMail(req, res){
        const { email } = req.body

         if (await User.findOne({ email })){
            return res.send(true)
        }
        return res.send(false) 
    },

    async getUserByToken(req, res){
        const { passwordResetToken } = req.body
        if (!passwordResetToken){
            return res.status(400).send({error: 'Token not found.'})
        }
        const user = await User.findOne({ passwordResetToken })
        return res.send({user})
    },

    //GET
    async index(req, res){
        const users = await User.find()
        return res.json(users)
    },
    //GET:id
    async show(req, res){
        const users = await User.findById(req.params.id)
        return res.json(users)
    },

    //POST
    async store(req, res){
        const { email } = req.body
        const salt = bcrypt.genSaltSync(10);
    
        try {
            if (await User.findOne({ email })){
                return res.status(400).send({ error: 'User already exists'})
            }

            req.body.password = await bcrypt.hashSync(req.body.password, salt)
            const user = await User.create(req.body)

            user.password = undefined

            return res.json({
                user, 
                token: generateToken({id: user.id})
            })
        } catch (error) {
            return res.status(400).send({ error: 'Registration failed'})
        }
        
    },

    async update(req, res){
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json(user)
    },

    async destroy(req, res){
        const user = await User.findById(req.params.id)
        await User.findByIdAndRemove(req.params.id)
        return res.json('user deleted')
    },

    async authenticate(req, res){
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email }).select('+password')
             
    
            if(!user){
                return res.status(400).send({ error: 'User not found'})
            }
    
            if(!await bcrypt.compareSync(password, user.password)){
                return res.status(400).send({ error: 'Invalid password'})
            }

            user.password = undefined

            return res.status(200).send({
                user, 
                token: generateToken({id: user.id})
            })

        } catch (error) {
            return res.status(400).send({ error: error})
        }
    },

    async lostPassword(req, res){
        const { email } = req.body

        try {
            const user = await User.findOne({ email })
            if(!user){
                res.status(400).send({ error: 'User not found'})
            }
            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1)
            

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            })
            mailer.sendMail({
                from: 'tauan_almeida@hotmail.com',
                to: email,
                template: 'auth/forgotPassword',
                context: {
                    token: token,
                    name: user.name,
                    email: email
                },
            }, (err) => {
                if (err){
                    res.status(400).send({error: 'cannot send forgot password in email'})
                }
                return res.send()
            })
        } catch (error) {
            res.status(400).send({ error: 'Erro on forgot password, try again'})
        }
    },

    async resetPassword(req, res){
        const { email, passwordResetToken, password } = req.body
        const token = passwordResetToken

        const salt = bcrypt.genSaltSync(10);

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires')
            
            if(!user){
               return res.status(400).send({ error: 'User not found'})
            }

            if (token !== user.passwordResetToken){
                return res.status(400).send({ error: 'Invalid Token'})
            }

            const now = new Date()

            if(now > user.passwordResetExpires){
                return res.status(400).send({ error: 'Token expired'})
            }

            user.password = await bcrypt.hashSync(password, salt)

            await user.save()
            return res.status(200).send({success: 'Success! new password confirmed'})

        } catch (error) {
            res.status(400).send({error: 'Cannot reset your password, try again!'})
        }
    }
}