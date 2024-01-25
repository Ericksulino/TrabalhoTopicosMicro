const route = require("express").Router();
const userController = require('../controllers/user.controller');
const {validId, validUser} = require("../middleware/global.middleware");

route.post("/", (req, res) => {
    userController.create(req, res)
        .then(status => {
            if (status === 201) {
                req.session.message = "Usuário criado com sucesso";
                req.session.type = "success";
                res.redirect("/Home");
            } else if (status === 400) {
                req.session.message = "Erro ao criar o usuário";
                req.session.type = "danger";
                res.redirect("/CadUser");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Erro ao criar usuário");
        });
});

route.get("/",userController.findAll);
route.get("/:id",validId, validUser,userController.findById);
route.patch("/:id",validId, validUser,userController.update);

module.exports = route;

