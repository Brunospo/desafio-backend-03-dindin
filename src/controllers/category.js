const { query } = require('../config/connection');

const listCategories = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM categorias');

    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

module.exports = {
  listCategories
};