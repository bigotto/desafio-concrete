const mongoose = require('mongoose')
const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senha: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    telefones: [{
        numero: {
            type: String,
            required: true
        },
        ddd: {
            type: String,
            required: true
        }
    }],
    data_criacao: {
        type: Date,
        default: Date.now
    },
    data_atualizacao: {
        type: Date,
        default: Date.now
    },
    ultimo_login: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, 'codigosenha')
    user.token = token
    await user.save()
    return token
}

// Hash
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('senha')) {
        user.senha = await bycript.hash(user.senha, 8)
    }
    next()
})

userSchema.statics.findEmail = async function (email) {
    const user = await User.findOne({
        email
    })
    if (user) {
        throw new Error('Email ja existente')
    }
}

userSchema.statics.findByCredentials = async (email, senha) => {
    user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Usuário e/ou senha inválidos')
    }
    const senhaMatchs = await bycript.compare(senha, user.senha)

    if (!senhaMatchs) {
        return false
    } else {
        const userUp = await User.findOneAndUpdate({
            email
        }, {
            ultimo_login: Date.now()
        }, {
            new: true
        })
        await userUp.save()
        return userUp
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User