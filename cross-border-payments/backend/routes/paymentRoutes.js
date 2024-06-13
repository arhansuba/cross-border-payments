const express = require('express');
const router = express.Router();
const { createPayment, getPayments, getPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/create', authenticate, createPayment);
router.get('/:userId', authenticate, getPayments);
router.get('/:paymentId', authenticate, getPayment);

module.exports = router;