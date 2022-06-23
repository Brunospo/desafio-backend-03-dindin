const { query } = require('../config/connection');
const { sumOfInputsOutputs } = require('../utils/utils');

const listTransactions = async (req, res) => {
  const { id } = req.loggedUser;
  const { filtro } = req.query;

  try {
    const text = `SELECT
      transacoes.id,
      tipo,
      transacoes.descricao AS descricao, 
      valor, 
      data, 
      usuario_id, 
      categoria_id, 
      categorias.descricao AS categoria_nome 
      FROM transacoes 
      JOIN usuarios 
      ON transacoes.usuario_id = usuarios.id 
      JOIN categorias 
      ON transacoes.categoria_id = categorias.id WHERE usuarios.id = $1`;
      const { rows } = await query(text, [id]);

    if (filtro) {
      const filteredTransactions = rows.filter(transaction => filtro.includes(transaction.categoria_nome));
      return res.status(200).json(filteredTransactions);
    }

    return res.status(200).json(rows);

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
}

const listTransaction = async (req, res) => {
  const { id } = req.params;
  const loggedUser = req.loggedUser;

  try {
    const text = `SELECT 
      transacoes.id, 
      tipo, 
      transacoes.descricao AS descricao, 
      valor, 
      data, 
      usuario_id, 
      categoria_id, 
      categorias.descricao AS categoria_nome 
      FROM transacoes 
      JOIN usuarios 
      ON transacoes.usuario_id = usuarios.id 
      JOIN categorias 
      ON transacoes.categoria_id = categorias.id 
      WHERE transacoes.id = $1 AND transacoes.usuario_id = $2`;
    const { rows } = await query(text, [id, loggedUser.id]);

    return res.status(200).json({...rows[0]});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

const registerTransaction = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id: userId } = req.loggedUser;
  const categoria_nome = req.categoryDescription;

  try {
    const text = 'INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const { rowCount, rows } = await query(text, [descricao, valor, data, categoria_id, userId, tipo]);

    if (rowCount === 0) {
      return res.status(500).json({"mensagem": "Não foi possível cadastrar transação."});
    }

    return res.status(201).json({...rows[0], categoria_nome});
  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

const updateTransaction = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.params;
  const loggedUser = req.loggedUser;

  try {
    const text = 'UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 AND usuario_id = $7';
    const { rowCount } = await query(text, [descricao, valor, data, categoria_id, tipo, id, loggedUser.id]);

    if (rowCount === 0) {
      return res.status(500).json({"mensagem": "Não foi possível atualizar transação."});
    }

    return res.status(204).json({});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const loggedUser = req.loggedUser;

  try {
    const { rowCount } = await query('DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2', [id, loggedUser.id]);

    if (rowCount === 0) {
      return res.status(500).json({"mensagem": "Não foi possível deletar transação."})
    }

    return res.status(204).json({});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

const getTransactionExtract = async (req, res) => {
  const { id } = req.loggedUser;

  try {
    const { rows } = await query('SELECT tipo, valor FROM transacoes WHERE usuario_id = $1', [id]);

    const { sumInputs: entrada, sumOutputs: saida } = sumOfInputsOutputs(rows);

    return res.status(200).json({entrada, saida});

  } catch (error) {
    return res.status(500).json({"mensagem": error.message});
  }
};

module.exports = {
  listTransactions,
  listTransaction,
  registerTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionExtract
};