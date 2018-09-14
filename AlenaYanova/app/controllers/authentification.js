'use strict';

const
  jwt = require('jsonwebtoken'),
  User = require('../models/user'),
  config = require('../../config/main'),
  handleError = require('../../utils/error_handler').handleError;

const generateToken = (user) => {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080
  });
};

const setUserInfo = (request) => {
  return {
    _id: request._id,
    name: request.profile.name,
    email: request.email,
    role: request.role,
  }
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(403).json({ error: 'This email not exist. Please try again.' });
      }
      return { isMatch: user.comparePassword(req.body.password), user }
    })
    .then(({ isMatch, user }) => {
      if (!isMatch) {
        return res.status(403).json({ error: 'Your password is incorrect. Please try again.' });
      }
      const userInfo = setUserInfo(user);
      return res.status(200).json({ token: generateToken(userInfo) });
    })
    .catch(err => handleError(err, res))
};

exports.register = (req, res) => {
  const { email, name, password } = req.body;
  if (!email) {
    return res.status(422).json({ error: 'You must enter an email address.' });
  }
  if (!name) {
    return res.status(422).json({ error: 'You must enter your name.' });
  }
  if (!password) {
    return res.status(422).json({ error: 'You must enter a password.' });
  }
  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(422).json({error: 'That email address is already in use.'});
      }
      let user = new User({
        email: email,
        password: password,
        profile: {name: name}
      });
      return user.save()
    })
    .then((user) => {
      let userInfo = setUserInfo(user);
      res.status(201).json({
        token: generateToken(userInfo)
      });
    })
    .catch(err => {
      return handleError(err, res);
    })
};

exports.checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token){
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err){
        res.status(403).json({ error: 'Failed to authentificate token.' })
      } else {
        // TODO: add redis for saving active tokens
        req.user = decoded;
        next();
      }
    })
  } else {
    res.status(403).json({ error: 'No token provided.' })
  }
};