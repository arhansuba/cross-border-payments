const Circle = require('../models/Circle');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class CircleService {
  async createCircle(userId, circleName) {
    const circle = new Circle({ userId, name: circleName, circleId: uuidv4() });
    await circle.save();

    // Create a default wallet for the circle
    const wallet = new Wallet({ userId, circleId: circle.circleId, balance: 0 });
    await wallet.save();

    return circle;
  }

  async getCircle(circleId) {
    return Circle.findById(circleId).populate('transactions');
  }

  async getCirclesForUser(userId) {
    return Circle.find({ userId }).populate('transactions');
  }

  async createTransaction(circleId, senderId, recipientId, amount) {
    const circle = await Circle.findById(circleId);
    if (!circle) {
      throw new Error('Circle not found');
    }

    const senderWallet = await Wallet.findOne({ userId: senderId, circleId });
    if (!senderWallet) {
      throw new Error('Sender wallet not found');
    }

    const recipientWallet = await Wallet.findOne({ userId: recipientId, circleId });
    if (!recipientWallet) {
      throw new Error('Recipient wallet not found');
    }

    if (senderWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Create a new transaction
    const transaction = new Transaction({
      circleId,
      senderId,
      recipientId,
      amount,
      transactionId: uuidv4(),
      createdAt: moment().unix(),
    });
    await transaction.save();

    // Update sender and recipient wallets
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;
    await senderWallet.save();
    await recipientWallet.save();

    return transaction;
  }

  async getTransactionsForCircle(circleId) {
    return Transaction.find({ circleId }).populate('sender').populate('recipient');
  }

  async getWalletBalance(userId, circleId) {
    const wallet = await Wallet.findOne({ userId, circleId });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet.balance;
  }

  async updateWalletBalance(userId, circleId, amount) {
    const wallet = await Wallet.findOne({ userId, circleId });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    wallet.balance += amount;
    await wallet.save();
    return wallet.balance;
  }
}

module.exports = CircleService;