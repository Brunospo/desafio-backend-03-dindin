const { query } = require('../config/connection');
const { isValidPassword } = require('../utils/securePassword');

const validateBodyAuthentication = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({"mensagem": "O campo email é obrigatório."});
  }

  if (!senha) {
    return res.status(400).json({"mensagem": "O campo senha é obrigatório."});
  }

  try {
    const { rowCount, rows: users } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if(rowCount === 0) {
      return res.status(404).json({"mensagem": "Usuário e/ou senha inválido(s)."});
    }

    const [ user ] = users;

    const validPassword = await isValidPassword(senha, user.senha, user.email);

    if (!validPassword){
      return res.status(400).json({"mensagem": "Usuário e/ou senha inválido(s)."});
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }

};

module.exports = {
  validateBodyAuthentication
};