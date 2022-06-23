const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { id, nome, email } = req.user;

  try {
    const token = jwt.sign({id, nome, email}, process.env.JWT_SECUREPASSWORD, {expiresIn: '2h'});
    
    return res.status(200).json({ usuario: {id, nome, email}, token });

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

module.exports = {
  loginUser
};