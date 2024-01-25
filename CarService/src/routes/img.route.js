const route = require("express").Router();
const authMiddleware = require("../middleware/auth.middlieware");

const upload = require("../middleware/img.middleware")

const ImgController = require("../controllers/img.controller");

route.post("/",authMiddleware,upload.single("file"),ImgController.create);

route.get("/",ImgController.findAll);

route.get("/:imageName", ImgController.getImage);

module.exports = route;