const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const circleService = require('../services/circleService');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, recipientId } = req.body;
    const senderId = req.userId;
    const senderWallet = await Wallet.findOne({ userId: senderId });
    const recipientWallet = await Wallet.findOne({ userId: recipientId });
    if (!senderWallet ||!recipientWallet) {
      return res.status(404).send({ message: 'Wallet not found' });
    }
    const payment = new Payment({
      amount,
      senderId,
      recipientId,
      status: 'pending',
    });
    await payment.save();
    // Call Circle API to initiate payment
    const circleResponse = await circleService.initiatePayment(
      senderWallet.address,
      recipientWallet.address,
      amount
    );
    payment.circleId = circleResponse.id;
    await payment.save();
    res.send({ message: 'Payment initiated successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error creating payment' });
  }
};

// Get a list of payments for a user
exports.getPayments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Payment.find({ $or: [{ senderId: userId }, { recipientId: userId }] });
    res.send(payments);
  } catch (error) {
    res.status(400).send({ message: 'Error getting payments' });
  }
};

// Get a specific payment
exports.getPayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }
    res.send(payment);
  } catch (error) {
    res.status(400).send({ message: 'Error getting payment' });
  }
};