const mongoose = require('mongoose');

const connectDatabase = () =>{
    console.log("Tentando conectar ao Banco");

    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology: true}
    ).then(() => console.log("MongoDB Conectado!")).catch((error) => console.log(error));
}; 

module.exports = connectDatabase;