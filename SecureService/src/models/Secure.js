const mongoose = require('mongoose');

const SecureSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true,
    },
    coberturaDanos: [{
        type: {
            type: String,
            required: true,
            enum: ['Colisão', 'Abrangente', 'Responsabilidade Civil', 'Furto', 'Incêndio'],
        },
    }],
    valorCobertura: {
        type: Number,
        required: true,
    },
    valorFranquia: {
        type: Number,
        required: true,
    },
});

const Secure = mongoose.model('Secure', SecureSchema);

module.exports = Secure;
