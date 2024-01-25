const carService = require("../services/car.service");
const fs = require("fs");
const path = require("path");

const create = async (req, res) => {
    try {
        if (req.role !== "Admin") {
            return res.status(403).send({ message: "Acesso não autorizado." });
        }
        const { nome, categoria, tipo, descricao, valor} = req.body;

        if (!nome || !categoria || !tipo || !descricao || !valor) {
            res.status(400).send({ message: "Envie todos os campos para o registro!" });
        } else {
            try {
                const file = req.file;
                console.log(path.basename(file.path));

                const img = path.basename(file.path);
                const car = await carService.createService({
                    nome,
                    categoria,
                    tipo,
                    descricao,
                    valor,
                    foto: img,
                    disponivel: true,
                });

                if (!car) {
                    res.status(400).send({ message: "Erro ao criar o Carro!" });
                }

                res.status(201).send({ message: "Carro criado com sucesso!" });
            } catch (err) {
                res.status(500).send({ message: err.message });
            }
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        let { limit, offset, disponivel} = req.query;
        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }
        if (!offset) {
            offset = 0;
        }
        // Convertendo 'disponivel' para booleano
        disponivel = disponivel === 'true';
        const cars = await carService.findAllService(offset, limit, disponivel);
        const total = await carService.countCars();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (cars.length == 0) {
            return res.status(400).send({ message: "Não há carros cadastrados" });
        }

        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            carros: cars.map((car) => {
                return {
                    id: car._id,
                    nome: car.nome,
                    categoria: car.categoria,
                    tipo: car.tipo,
                    descricao: car.descricao,
                    valor: car.valor,
                    foto: car.foto,
                    disponivel: car.disponivel,
                    dataInicioLocacao: car.dataInicioLocacao,
                    dataTerminoLocacao: car.dataTerminoLocacao,
                };
            }),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const rentCar = async (req, res) => {
    try {
        const id = req.params.id;
        const locatario = req.userId; // Obtém o locatário do req.userId
        const { seguro, dataInicioLocacao, dataTerminoLocacao } = req.body;

        // Verifica se o carro está disponível para locação
        const prodCar = await carService.findByIdService(id);
        if (!prodCar.disponivel) {
            return res.status(400).send({ message: "O carro não está disponível para locação." });
        }

        // Atualiza o status do carro para não disponível e adiciona o locatário
        const updatedCar = await carService.addLocatarioService(id, locatario);

        // Atualiza as datas de início e término da locação
        const updateCarDates = await carService.updateRentDates(id, dataInicioLocacao, dataTerminoLocacao, false, seguro);

        // Verifica se houve algum erro nas operações
        if (!updatedCar || !updateCarDates) {
            return res.status(500).send({ message: "Erro ao alugar o carro." });
        }

        res.status(200).send({ message: "Carro alugado com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const returnCar = async (req, res) => {
    try {
        const id = req.params.id;
        const locatario = req.userId; // Obtém o locatário do req.userId

        // Verifica se o carro está disponível para desaluguel
        const prodCar = await carService.findByIdService(id);
        if (!prodCar || prodCar.disponivel) {
            return res.status(400).send({ message: "O carro não está disponível para desaluguel." });
        }

        // Verifica se o locatário atual é quem está tentando desalugar
        if (!prodCar.locatario.equals(locatario)) {
            return res.status(403).send({ message: "Você não tem permissão para desalugar este carro." });
        }

        // Atualiza o status do carro para disponível e remove o locatário
        const updatedCar = await carService.removeLocatarioService(id);

        // Verifica se houve algum erro nas operações
        if (!updatedCar) {
            return res.status(500).send({ message: "Erro ao desalugar o carro." });
        }

        res.status(200).send({ message: "Carro desalugado com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


const topCar = async (req, res) => {
    try {
        const prodCar = await carService.topCarService();

        if (!prodCar) {
            return res.status(400).send({ message: "Não há carro registrado!" });
        }

        res.send({
            carro: {
                id: prodCar._id,
                nome: prodCar.nome,
                categoria: prodCar.categoria,
                tipo: prodCar.tipo,
                descricao: prodCar.descricao,
                valor: prodCar.valor,
                foto: prodCar.foto,
                locadorName: prodCar.locador.name,
                locadorNumber: prodCar.locador.number,
                locadorCity: prodCar.locador.city,
                locadorUF: prodCar.locador.state,
                disponivel: prodCar.disponivel,
                dataInicioLocacao: prodCar.dataInicioLocacao,
                dataTerminoLocacao: prodCar.dataTerminoLocacao,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const prodCar = await carService.findByIdService(id);

        if (!prodCar) {
            return res.status(400).send({ message: "Não há carro registrado!" });
        }

        res.send({
            carro: {
                id: prodCar._id,
                nome: prodCar.nome,
                categoria: prodCar.categoria,
                tipo: prodCar.tipo,
                descricao: prodCar.descricao,
                valor: prodCar.valor,
                foto: prodCar.foto,
                disponivel: prodCar.disponivel,
                seguro: prodCar.seguro,
                dataInicioLocacao: prodCar.dataInicioLocacao,
                dataTerminoLocacao: prodCar.dataTerminoLocacao,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const searchByNome = async (req, res) => {
    try {
        const { nome } = req.query;
        const prodCar = await carService.searchByNomeService(nome);

        if (prodCar.length === 0) {
            return res.status(400).send({ message: "Não há carro registrado com esse nome!" });
        }

        res.send({
            carros: prodCar.map((prodCar) => {
                return {
                    id: prodCar._id,
                    nome: prodCar.nome,
                    categoria: prodCar.categoria,
                    descricao: prodCar.descricao,
                    tipo: prodCar.tipo,
                    valor: prodCar.valor,
                    foto: prodCar.foto,
                    disponivel: prodCar.disponivel,
                    dataInicioLocacao: prodCar.dataInicioLocacao,
                    dataTerminoLocacao: prodCar.dataTerminoLocacao,
                };
            }),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const prodCar = await carService.byUserService(id);

        if (prodCar.length === 0) {
            return res.status(400).send({ message: "Não há carro registrado nesse locador!" });
        }

        res.send({
            carros: prodCar.map((prodCar) => {
                return {
                    id: prodCar._id,
                    nome: prodCar.nome,
                    categoria: prodCar.categoria,
                    descricao: prodCar.descricao,
                    tipo: prodCar.tipo,
                    valor: prodCar.valor,
                    foto: prodCar.foto,
                    disponivel: prodCar.disponivel,
                    seguro: prodCar.seguro,
                    dataInicioLocacao: prodCar.dataInicioLocacao,
                    dataTerminoLocacao: prodCar.dataTerminoLocacao,
                };
            }),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const filterByCategory = async (req, res) => {
    try {
        const { categoria } = req.query;
        const prodCar = await carService.filterByCategoryService(categoria);

        if (prodCar.length === 0) {
            return res.status(400).send({ message: "Não há carro registrado nessa categoria!" });
        }

        res.send({
            carros: prodCar.map((prodCar) => {
                return {
                    id: prodCar._id,
                    nome: prodCar.nome,
                    categoria: prodCar.categoria,
                    descricao: prodCar.descricao,
                    tipo: prodCar.tipo,
                    valor: prodCar.valor,
                    foto: prodCar.foto,
                    disponivel: prodCar.disponivel,
                    dataInicioLocacao: prodCar.dataInicioLocacao,
                    dataTerminoLocacao: prodCar.dataTerminoLocacao,
                };
            }),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const filterByType = async (req, res) => {
    try {
        const { tipo } = req.query;
        const prodCar = await carService.filterByTypeService(tipo);

        if (prodCar.length === 0) {
            return res.status(400).send({ message: "Não há carro registrado nesse tipo!" });
        }

        res.send({
            carros: prodCar.map((prodCar) => {
                return {
                    id: prodCar._id,
                    nome: prodCar.nome,
                    categoria: prodCar.categoria,
                    tipo: prodCar.tipo,
                    descricao: prodCar.descricao,
                    valor: prodCar.valor,
                    foto: prodCar.foto,
                    disponivel: prodCar.disponivel,
                    dataInicioLocacao: prodCar.dataInicioLocacao,
                    dataTerminoLocacao: prodCar.dataTerminoLocacao,
                };
            }),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        if (req.role !== "Admin") {
            return res.status(403).send({ message: "Acesso não autorizado." });
        }
        const { nome, categoria, tipo, descricao, valor, dataInicioLocacao, dataTerminoLocacao } = req.body;
        const id = req.params.id;
        const file = req.file;
        let foto = undefined;
        if (typeof file !== "undefined") {
            foto = path.basename(file.path);
        }

        if (!nome && !categoria && !tipo && !descricao && !valor && !dataInicioLocacao && !dataTerminoLocacao) {
            res.status(400).send({ message: "Envie pelo menos um campo para atualizar!" });
        } else {
            const prodCar = await carService.findByIdService(id);

            if (prodCar.locador._id !== req.userId) {
                res.status(400).send({ message: "Você não pode atualizar um carro que não seja seu!" });
            }

            const oldFoto = prodCar.foto;

            // Lógica para atualizar a disponibilidade com base nas novas datas de locação
            if (dataInicioLocacao && dataTerminoLocacao) {
                const currentDate = new Date();
                if (dataInicioLocacao <= currentDate && currentDate <= dataTerminoLocacao) {
                    await carService.updateAvailability(id, false);
                } else {
                    await carService.updateAvailability(id, true);
                }
            }

            if (typeof foto !== "undefined" && foto) {
                await carService.updateService(id, nome, categoria, tipo, descricao, valor, foto, dataInicioLocacao, dataTerminoLocacao);
                await fs.promises.unlink("src/uploads/" + oldFoto);
            } else {
                await carService.updateService(id, nome, categoria, tipo, descricao, valor, undefined, dataInicioLocacao, dataTerminoLocacao);
            }

            res.status(201).send({ message: "Carro atualizado com sucesso!" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const erase = async (req, res) => {
    if (req.role !== "Admin") {
        return res.status(403).send({ message: "Acesso não autorizado." });
    }
    try {
        const id = req.params.id;
        const prodCar = await carService.findByIdService(id);
        const oldFoto = prodCar.foto;

        if (prodCar.locador._id !== req.userId) {
            res.status(400).send({ message: "Você não pode excluir um carro que não seja seu!" });
        }

        await carService.eraseService(id);
        await fs.promises.unlink("src/uploads/" + oldFoto);
        res.status(201).send({ message: "Carro excluído com sucesso!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = {
    create,
    findAll,
    rentCar,
    returnCar,
    topCar,
    findById,
    searchByNome,
    byUser,
    filterByCategory,
    filterByType,
    update,
    erase,
};
