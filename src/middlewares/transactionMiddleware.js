const { query } = require('../config/connection');

const validateId = async (req, res, next) => {
  const { id: transactionId } = req.params;
  const { id: userId } = req.loggedUser;

  try {
    const { rowCount, rows } = await query('SELECT * FROM transacoes WHERE id = $1', [transactionId]);

    if (rowCount === 0) {
      return res.status(404).json({"mensagem": "Não foi encontrada nenhuma transação para o id informado."});
    }

    const [transaction] = rows;

    if (transaction.usuario_id !== userId) {
      return res.status(403).json({"mensagem": "Essa transação não pertence a esse usuário."});
    }

    next();
  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
}

const validateBody = async (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  if (!descricao) {
    return res.status(400).json({"mensagem": "O campo descricao é obrigatório."});
  }

  if (valor === undefined) {
    return res.status(400).json({"mensagem": "O campo valor é obrigatório."});
  }

  if (!data) {
    return res.status(400).json({"mensagem": "O campo data é obrigatório."});
  }

  if (categoria_id === undefined) {
    return res.status(400).json({"mensagem": "O campo categoria_id é obrigatório."});
  }

  if (!tipo) {
    return res.status(400).json({"mensagem": "O campo tipo é obrigatório."});
  }

  const types = ['entrada', 'saida'];

  if (!types.includes(tipo)) {
    return res.status(400).json({"mensagem": "O campo tipo só aceita os valores 'entrada' ou 'saida'."});
  }

  try {
    const { rowCount, rows } = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

    if (rowCount === 0) {
      return res.status(404).json({"mensagem": "Não existe categoria para o categoria_id informado."});
    }

    req.categoryDescription = rows[0].descricao;
    next();

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
}

module.exports = {
  validateId,
  validateBody
};