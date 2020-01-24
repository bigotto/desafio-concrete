const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDB
} = require('./fixtures/db')

beforeEach(setupDB)

test('Deve Cadastrar um novo usuário', async () => {
    const response = await request(app).post('/signup').send({
        "nome": "Bruno Bigotto",
        "email": "brunobigotto@hotmail.com",
        "senha": "12345678",
        "telefones": [{
            "numero": "996193464",
            "ddd": "67"
        }]
    }).expect(201)
})

test('Não deve aceitar o cadastro, email existente no DB', async () => {
    const response = await request(app).post('/signup').send({
        nome: 'Antonio César',
        email: 'antonioc@gmail.com',
        senha: 'antonio123',
        telefones: [{
            numero: 998765432,
            ddd: 11
        }],
    }).expect(400)

    expect(response.text).toBe('Email ja existente')
})

test('Tentativa de cadastro com um endereço de email inválido', async () => {
    const response = await request(app).post('/signup').send({
        nome: 'Edson',
        email: 'edson@.com',
        senha: 'edson123',
        telefones: [{
            numero: 12345678,
            ddd: 17
        }],
    }).expect(400)
})

test('Tentativa de cadastro com uma senha menor que 8 caracteres', async () => {
    const response = await request(app).post('/signup').send({
        nome: 'Antonio César',
        email: 'antonioc@gmail.com',
        senha: 'antonio123',
        telefones: [{
            numero: 12345,
            ddd: 11
        }],
    }).expect(400)
})

test('Login com email e senha corretos', async () => {
    const response = await request(app).post('/signin').send({
        email: userOne.email,
        senha: userOne.senha
    }).expect(200)
})

test('Login com senha incorreta', async () => {
    const response = await request(app).post('/signin').send({
        email: userOne.email,
        senha: '12345678'
    }).expect(401)

    expect(response.text).toBe('Usuário e/ou senha inválidos')
})

test('Login com email inexistente', async () => {
    const response = await request(app).post('/signin').send({
        email: 'fulano@servidor.com',
        senha: '12345678'
    }).expect(400)

    expect(response.text).toBe('Usuário e/ou senha inválidos')
})

test('Buscar usuário com o login maior que 30 minutos', async () => {
    const response = await request(app).get('/search')
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            email: userTwo.email,
            senha: userTwo.senha
        }).expect(401)

    expect(response.text).toBe('Sessão inválida')
})

test('Buscar usuário com o login menor que 30 minutos', async () => {
    const response = await request(app).get('/search')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            email: userOne.email,
            senha: userOne.senha
        }).expect(200)
})

test('Buscar usuário com o token errado', async () => {
    const response = await request(app).get('/search')
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            email: userOne.email,
            senha: userOne.senha
        }).expect(401)
})