const mongoose = require('mongoose')

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
}, {
    timestamps: true
})

// userSchema.methods.generateAuthToken = async function () {
//     const user = this
//     const token jwt.sign({ _id: user._id.toString() }, 'teste')
// }

const User = mongoose.model('User', userSchema)
module.exports = User