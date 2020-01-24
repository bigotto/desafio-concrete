const mongoose = require('mongoose')
const validator = require('validator')
const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Constrói a coleção do DB 
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email inválido')
            }
        }
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
// Método no qual gera o token vinculado ao usuário
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)
    user.token = token
    await user.save()
    return token
}

// Hash da senha
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('senha')) {
        user.senha = await bycript.hash(user.senha, 8)
    }
    next()
})

// Busca o email para não permitir cadastro com o mesmo email no sistema
userSchema.statics.findEmail = async function (email) {
    const user = await User.findOne({
        email
    })
    if (user) {
        throw new Error('Email ja existente')
    }
}
// Verifica se email e senha são compativeis ao realizar o login no sistema
userSchema.statics.findByCredentials = async (email, senha) => {
    user = await User.findOne({
        email
    })
    // Se o usuário não for encontrado no DB
    if (!user) {
        throw new Error('Usuário e/ou senha inválidos')
    }
    // Verifica se a senha está correta 
    const senhaMatchs = await bycript.compare(senha, user.senha)

    if (!senhaMatchs) {
        return false
    } else {
        const userUp = await User.findOneAndUpdate({
            email
        }, {
            ultimo_login: Date.now() // Atuliza o horário do ultimo login com o atual
        }, {
            new: true // retorna o objeto atualizado
        })
        await userUp.save()
        return userUp
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User