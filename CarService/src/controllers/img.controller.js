const { json } = require("express");

const fs = require("fs");
const path = require("path");

const create = async (req,res) =>{
    try{

        const file = req.file
        console.log( path.basename(file.path));

        const img = path.basename(file.path);

        res.status(200).json({img,msg: "Imagem salva com sucesso!"})

    } catch(error){
        res.status(500).json({mesage: "Erro ao salvar a imagem."})
    }
} ;

const findAll = async (req,res) =>{
    try{
        const imagens = await Img.find()

        res.status(200).json(imagens);

    } catch (error){
        res.status(500).json({message:"Erro ao buscar imagens."})
    }
}

const getImage = (req, res) => {
    try{const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, "../uploads", imageName);
    const image = fs.readFileSync(imagePath);
    res.contentType("image/png/jpg/jpeg");
    res.send(image);
    }catch(erro){
        res.status(500).send(erro);
    }
  };

 
module.exports = {
    create,
    findAll,
    getImage,
}
