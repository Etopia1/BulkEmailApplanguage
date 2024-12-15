const express = require('express');
const { sendEmail } = require('../controllers/emailController');
const validateEmail = require('../middlewares/emailvalidator');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/send', validateEmail,auth ,sendEmail);

module.exports = router;
