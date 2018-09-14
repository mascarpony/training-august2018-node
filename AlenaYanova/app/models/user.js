'use strict';

const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    name: { type: String }
  },
  role: {
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

UserSchema.pre('save', function(next) {
  const user = this,
    SALT_FACTOR = 5;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  const userPassword = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
      if (err) { return reject(err); }
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);