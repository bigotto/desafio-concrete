const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.get('', (req, res) => {
    res.send('Alive')
})

router.post('/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await User.findEmail(req.body.email)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.senha)
        if (!user) {
            return res.status(401).send('Usuário e/ou senha inválidos')
        }
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router