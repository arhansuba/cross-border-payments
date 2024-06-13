const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Please authenticate' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;