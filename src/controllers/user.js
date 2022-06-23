const { query } = require('../config/connection');
const { encryptPassword } = require('../utils/securePassword');

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const encryptedPassword = await encryptPassword(senha);

    const text = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
    const { rows: user, rowCount } = await query(text, [nome, email, encryptedPassword]);

    if (rowCount === 0) {
      return res.status(500).json({"mensagem": "Não foi possível cadastrar usuário."});
    }

    return res.status(201).json({...user[0]});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
}

const userDetails = (req, res) =>  {
  const loggedUser = req.loggedUser;
  
  return res.status(200).json({...loggedUser});
}

const updateUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.loggedUser;

  try {
    const encryptedPassword = await encryptPassword(senha);

    const text = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
    const { rowCount } = await query(text, [nome, email, encryptedPassword, id]);

    if (rowCount === 0) {
      return res.status(500).json({"mensagem": "Não foi possível atualizar usuário."});
    }

    return res.status(204).json({});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

module.exports = {
  registerUser,
  userDetails,
  updateUser
};