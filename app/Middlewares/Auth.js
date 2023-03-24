const jwt = require('jsonwebtoken');
const { sequelize } = require("../Models/index");
const User = require('../Models/user');

const loginAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];

      // Verify Token

      const { userId } = jwt.verify(token, 'zxcvbnm');

      // Get User From Token
      req.user = await User.findOne({
        where: { id: userId }
      });

      return next();

    } catch (err) {
      return res.status(400).json({
        'status': 'Failed',
        'message': 'unauthorized user no token'
      });
    }
  }
  if (!token) {
    return res.status(400).json({
      'status': 'Failed',
      'message': 'unauthorized user no token'
    })
  }

};

module.exports = loginAuth;