require('dotenv').config();
const jwt = require('jsonwebtoken');
const { query } = require('../config/connection');

const validateToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
  }

  try {
    const token = authorization.replace('Bearer ', "").trim();

    const { id } = jwt.verify(token, process.env.JWT_SECUREPASSWORD);

    const { rowCount, rows: users } = await query('SELECT * FROM usuarios WHERE id = $1',[id]);
    
    if (rowCount === 0){
      return res.status(404).json({ "mensagem": "Usuário não encontrado" });
    }

    const [ user ] = users;

    req.loggedUser = { id: user.id, nome: user.nome, email: user.email };

    next();

  } catch (error) {
    return res.status(500).json({"mensagem": `Erro interno: ${error.message}`});
  }

};

module.exports = {
  validateToken
};