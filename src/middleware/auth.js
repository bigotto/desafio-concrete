const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'codigosenha')
        const user = await User.findOne({
            _id: decoded._id,
            token
        })

        if (!user) {
            throw new Error('Não autorizado')
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(e.message)
    }
}

module.exports = auth