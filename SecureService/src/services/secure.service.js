const Secure = require('../models/Secure')
const createService = (body) => Secure.create(body);

const findAllService = async () => {
    try {
        const seguros = await Secure.find();
        return seguros;
    } catch (err) {
        throw new Error(err.message);
    }
};

const findByIdService = (id) => Secure.findById(id);

const findByDescricaoService = async (descricao) => {
    try {
        const secure = await Secure.findOne({ descricao });
        return secure;
    } catch (err) {
        throw new Error(err.message);
    }
};

const findByCoberturaDanosService = async (tipoCobertura) => {
    try {
        const secureList = await Secure.find({ 'coberturaDanos.type': tipoCobertura });
        return secureList;
    } catch (err) {
        throw new Error(err.message);
    }
};

const updateService = async (secureId, updatedData) => {
    
    try {
        const secure = await Secure.findByIdAndUpdate(secureId, updatedData, { new: true });

        if (!secure) {
            throw new Error('Seguro não encontrado.');
        }

        return secure;
    } catch (err) {
        throw new Error(err.message);
    }
};


const eraseService = async (secureId) => {
    try {
        const secure = await Secure.findByIdAndDelete(secureId);

        if (!secure) {
            throw new Error('Seguro não encontrado.');
        }

        return secure;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    createService,
    findAllService,
    findByIdService,
    findByDescricaoService,
    findByCoberturaDanosService,
    updateService,
    eraseService
};