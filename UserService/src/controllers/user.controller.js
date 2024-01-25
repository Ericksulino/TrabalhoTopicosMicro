const userService = require("../services/user.service");

const create = async (req, res) => {
    try {
        const { name, email, number, city, state, password, role } = req.body;

        if (!name || !email || !number || !city || !state || !password) {
            res.status(400).send({ message: "Envie todos os campos para o registro!" });
        } else {
            const userExist = await userService.findByEmail(email);

            if (userExist) {
                res.status(400).send({ message: "Email já cadastrado!" });
            } else {
                try {
                    const user = await userService.createService({
                        name,
                        email,
                        number,
                        city,
                        state,
                        password,
                        role, // Adiciona o campo role, se fornecido
                    });

                    if (!user) {
                        res.status(400).send({ message: "Erro ao criar o usuário!" });
                    }

                    res.status(201).send({
                        message: "Usuário criado com sucesso!",
                        user: {
                            id: user._id,
                            name,
                            email,
                            number,
                            password,
                            role: user.role, // Retorna o valor atribuído ao campo role
                        },
                    });
                } catch (erro) {
                    res.status(500).send({ message: erro.message });
                }
            }
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    const users = await userService.findAllService();

    if (users.length === 0) {
        return res.status(400).send({ message: "Não há usuários cadastrados" });
    }

    res.send(users);
};

const findById = async (req, res) => {
    const user = req.user;
    res.send(user);
};

const update = async (req, res) => {
    const { name, email, number, password } = req.body;

    if (!name && !email && !number && !password) {
        res.status(400).send({ message: "Envie pelo menos um campo para a atualização!" });
    }

    const { id, user } = req;

    // Verifica se o usuário tem permissão para atualizar (papel de "Admin")
    if (user.role !== "Admin" && id !== user.id) {
        return res.status(403).send({ message: "Acesso não autorizado." });
    }

    await userService.updateService(id, name, email, number, password);
    res.send({ message: "Atualização de usuário realizada com sucesso" });
};

module.exports = { create, findAll, findById, update };
