const { Router } = require('express');
const { validateToken } = require('../middlewares/validateTokenMiddleware');
const { 
    listTransactions, 
    listTransaction, 
    registerTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getTransactionExtract } = require('../controllers/transaction');
const { validateId, validateBody } = require('../middlewares/transactionMiddleware');

const router = Router();

router.use(validateToken);
router.get('/', listTransactions);
router.get('/extrato', getTransactionExtract);
router.get('/:id', validateId, listTransaction);
router.post('/', validateBody, registerTransaction);
router.put('/:id', validateId, validateBody, updateTransaction);
router.delete('/:id', validateId, deleteTransaction);

module.exports = router;