const { Router } = require('express');
const { validateToken } = require('../middlewares/validateTokenMiddleware');
const { listCategories } = require('../controllers/category');

const router = Router();

router.use(validateToken);
router.get('/', listCategories);

module.exports = router;