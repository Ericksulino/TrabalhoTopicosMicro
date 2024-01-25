const secureService = require('../services/secure.service');

const create = async (req, res) => {
    try {
        if (req.role !== "Admin") {
            return res.status(403).send({ message: "Acesso não autorizado." });
        }
        const { descricao, coberturaDanos, valorCobertura, valorFranquia } = req.body;

        // Verifique se todos os campos necessários estão presentes
        if (!descricao || !coberturaDanos || !valorCobertura || !valorFranquia) {
            res.status(400).send({ mensagem: "Envie todos os campos para o registro!" });
        } else {
            try {
                // Crie o seguro usando o serviço apropriado (supondo que você tenha um serviço chamado secureService)
                const secure = await secureService.createService(req.body);

                if (!secure) {
                    res.status(400).send({ mensagem: "Erro ao cadastrar o seguro!" });
                }

                res.status(201).send({
                    mensagem: "Seguro cadastrado com sucesso!",
                    secure: {
                        id: secure._id,
                        descricao,
                        coberturaDanos,
                        valorCobertura,
                        valorFranquia,
                    }
                });
            } catch (err) {
                res.status(500).send({ mensagem: err.message });
            }
        }
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        const seguros = await secureService.findAllService();
        
        if (seguros.length === 0) {
            res.status(404).send({ mensagem: "Nenhum seguro encontrado." });
        } else {
            res.status(200).send({ seguros });
        }
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
}

const findById = async (req, res) => {
    const { secureId } = req.params;

    try {
        const secure = await secureService.findByIdService(secureId);

        if (!secure) {
            return res.status(404).send({ mensagem: "Seguro não encontrado." });
        }

        res.status(200).send({ secure });
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

const findByDescricao = async (req, res) => {
    const { descricao } = req.params;

    try {
        const secure = await secureService.findByDescricaoService(descricao);

        if (!secure) {
            return res.status(404).send({ mensagem: "Seguro não encontrado." });
        }

        res.status(200).send({ secure });
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

const findByCoberturaDanos = async (req, res) => {
    const { tipoCobertura } = req.params;

    try {
        const secureList = await secureService.findByCoberturaDanosService(tipoCobertura);

        if (!secureList || secureList.length === 0) {
            return res.status(404).send({ mensagem: "Seguros não encontrados para a cobertura de danos especificada." });
        }

        res.status(200).send({ secureList });
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

const update = async (req, res) => {
    if (req.role !== "Admin") {
        return res.status(403).send({ message: "Acesso não autorizado." });
    }
    const { secureId } = req.params;
    const updatedData = req.body;

    try {
        const existingSecure = await findByIdService(secureId);

        if (!existingSecure) {
            return res.status(404).send({ mensagem: "Seguro não encontrado." });
        }

        const secure = await secureService.updateService(secureId, updatedData);

        if (!secure) {
            res.status(400).send({ message: "Erro ao atualizar o Seguro!" });
        }

        res.status(200).send({ mensagem: "Seguro atualizado com sucesso!", secure });
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

const erase = async (req, res) => {
    if (req.role !== "Admin") {
        return res.status(403).send({ message: "Acesso não autorizado." });
    }
    const { secureId } = req.params;

    try {
        const existingSecure = await findByIdService(secureId);

        if (!existingSecure) {
            return res.status(404).send({ mensagem: "Seguro não encontrado." });
        }

        const secure = await secureService.deleteService(secureId);

        if (!secure) {
            res.status(400).send({ message: "Erro ao deletar o Seguro!" });
        }

        res.status(200).send({ mensagem: "Seguro excluído com sucesso!", secure });
    } catch (err) {
        res.status(500).send({ mensagem: err.message });
    }
};

module.exports = { 
    create,
    findAll,
    findById,
    findByDescricao,
    findByCoberturaDanos,
    update,
    erase
 };