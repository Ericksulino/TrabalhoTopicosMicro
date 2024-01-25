const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    seguro: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Sedan', 'SUV', 'Compacto', 'Esportivo', 'Van', 'Caminhonete'],
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Automático', 'Manual'],
    },
    descricao: {
        type: String,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
    locatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    foto: {
        type: String,
        required: true,
    },
    disponivel: {
        type: Boolean,
        default: true,
    },
    dataInicioLocacao: {
        type: Date,
        required: false,
    },
    dataTerminoLocacao: {
        type: Date,
        required: false,
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
});

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;