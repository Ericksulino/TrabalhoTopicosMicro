const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");
const axios = require('axios'); // Importe o Axios para fazer solicitações HTTP

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ message: "Não autorizado - Token ausente" });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2) {
      return res.status(401).send({ message: "Não autorizado - Formato inválido do token" });
    }

    const [schema, token] = partes;

    if (schema !== 'Bearer') {
      return res.status(401).send({ message: "Não autorizado - Esquema inválido" });
    }

    // Chama a rota de validação do token no microserviço de usuário
    try {
      const respostaMicroservico = await axios.get(
        `http://18.230.195.216:443/auth`,
        { headers: { Authorization: authorization } }
      );

      //console.log("Resposta do microserviço:", respostaMicroservico.data);

      const { message, user, role} = respostaMicroservico.data;

      if (message !== "token válido") {
        return res.status(401).send({ message: "Não autorizado - Token inválido" });
      }

      // Anexa as informações do usuário ao objeto de requisição
      req.userId = user;
      req.role = role;

      return next();
    } catch (error) {
      console.error("Erro ao validar o token no microserviço:", error);
      return res.status(401).send({ message: "Não autorizado - Erro no microserviço" });
    }
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};
