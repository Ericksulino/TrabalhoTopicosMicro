const route = require("express").Router();
const carController = require("../controllers/car.controller");
const authMiddleware = require("../middleware/auth.middlieware");
const upload = require("../middleware/img.middleware");

route.post("/", authMiddleware, upload.single("file"), carController.create);

// Nova rota para alugar um carro
route.post("/rent/:id", authMiddleware, carController.rentCar);

// Nova rota para desalugar um carro
route.patch('/return/:id', authMiddleware, carController.returnCar);

route.get("/", carController.findAll);

route.get("/top", carController.topCar);

route.get("/search", carController.searchByNome);

route.get("/category", carController.filterByCategory);

route.get("/type", carController.filterByType);

route.get("/byUser", authMiddleware, carController.byUser);

route.get("/:id", carController.findById);

route.patch("/:id", authMiddleware, upload.single("file"), carController.update);

route.delete("/:id", authMiddleware, carController.erase);

module.exports = route;
