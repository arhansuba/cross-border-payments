const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const authMiddleware = require('./authMiddleware');
const circleService = require('./services/circleService');
const transactionService = require('./services/transactionService');
const walletService = require('./services/walletService');

// Database connection
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Authentication middleware
app.use(authMiddleware);

// Routes
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the API!' });
});

app.post('/api/circles', async (req, res) => {
  try {
    const circle = await circleService.createCircle(req.body.userId, req.body.circleName);
    res.send(circle);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to create circle' });
  }
});

app.get('/api/circles/:circleId', async (req, res) => {
  try {
    const circle = await circleService.getCircle(req.params.circleId);
    res.send(circle);
  } catch (err) {
    console.error(err);
    res.status(404).send({ error: 'Circle not found' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.body.circleId, req.body.senderId, req.body.recipientId, req.body.amount);
    res.send(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to create transaction' });
  }
});

app.get('/api/wallets/:userId/:circleId', async (req, res) => {
  try {
    const wallet = await walletService.getWalletBalance(req.params.userId, req.params.circleId);
    res.send({ balance: wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(404).send({ error: 'Wallet not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});