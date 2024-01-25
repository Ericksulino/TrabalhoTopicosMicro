const routes = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middlieware");

routes.post("/",authController.login);

routes.get("/",authMiddleware,authController.valid);

module.exports = routes;