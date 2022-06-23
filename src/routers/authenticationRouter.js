const { Router } = require('express');
const { loginUser } = require('../controllers/authentication');
const { validateBodyAuthentication } = require('../middlewares/authenticationMiddleware');

const router = Router();

router.post('/', validateBodyAuthentication, loginUser);

module.exports = router;