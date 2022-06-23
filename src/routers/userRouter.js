const { Router } = require('express');
const { registerUser, userDetails, updateUser } = require('../controllers/user');
const { validateBodyRegister, validateBodyUpdate } = require('../middlewares/userMiddleware');
const { validateToken } = require('../middlewares/validateTokenMiddleware');

const router = Router();

router.post('/', validateBodyRegister, registerUser);
router.use(validateToken);
router.get('/', userDetails);
router.put('/', validateBodyUpdate, updateUser);

module.exports = router;