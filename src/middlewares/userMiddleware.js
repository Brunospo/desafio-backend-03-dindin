const { query } = require('../config/connection');

const validateBodyRegister = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome) {
    return res.status(400).json({"mensagem": "O campo nome é obrigatório."});
  }

  if (!email) {
    return res.status(400).json({"mensagem": "O campo email é obrigatório."});
  }

  if (!senha) {
    return res.status(400).json({"mensagem": "O campo senha é obrigatório."});
  }

  try {
    const { rowCount } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if(rowCount !== 0) {
      return res.status(400).json({"mensagem": "Já existe usuário cadastrado com o e-mail informado."});
    }

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }

  next();
}

const validateBodyUpdate = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome) {
    return res.status(400).json({"mensagem": "O campo nome é obrigatório."});
  }

  if (!email) {
    return res.status(400).json({"mensagem": "O campo email é obrigatório."});
  }

  if (!senha) {
    return res.status(400).json({"mensagem": "O campo senha é obrigatório."});
  }

  try {
    const { rowCount } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (rowCount !== 0) {
      return res.status(400).json({"mensagem": "O e-mail informado já está sendo utilizado por outro usuário."});
    }

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }

  next();
};

module.exports = {
  validateBodyRegister,
  validateBodyUpdate
};