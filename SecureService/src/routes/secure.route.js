const route = require("express").Router();
const secureController = require('../controllers/secure.controller');
const authMiddleware = require("../middleware/auth.middlieware");

// Rotas para CRUD (Create, Read, Update, Delete)
route.post("/",authMiddleware, secureController.create); // Rota para criar um novo seguro

route.get("/", secureController.findAll); // Rota para buscar todos os seguros

route.get('/:secureId', secureController.findById); // Rota para buscar um seguro pelo ID

route.get('/descricao/:descricao', secureController.findByDescricao); // Rota para buscar um seguro pela descrição

route.get('/cobertura-danos/:tipoCobertura', secureController.findByCoberturaDanos); // Rota para buscar seguros por cobertura de danos

route.put('/:secureId', authMiddleware, secureController.update); // Rota para atualizar um seguro pelo ID

route.delete('/:secureId', authMiddleware, secureController.erase); // Rota para excluir um seguro pelo ID

module.exports = route;