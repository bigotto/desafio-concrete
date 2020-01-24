const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    nome: 'Antonio César',
    email: 'antonioc@gmail.com',
    senha: 'antonio123',
    telefones: [{
        numero: 998765432,
        ddd: 11
    }],
    token: jwt.sign({
        _id: userOneId
    }, process.env.JWT_SECRET)
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    nome: 'Alexandre Henrique',
    email: 'alehenrique@gmail.com',
    senha: 'alehenrique',
    telefones: [{
        numero: 123456789,
        ddd: 11
    }],
    data_criacao: new Date(2020, 0, 20, 12, 30, 26, 0),
    data_atualizacao: new Date(2020, 0, 20, 12, 30, 26, 0),
    ultimo_login: new Date(2020, 0, 20, 12, 30, 26, 0),
    token: jwt.sign({
        _id: userTwoId
    }, process.env.JWT_SECRET)
}

const setupDB = async () => {
    await User.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDB
}