'use strict';

const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  id: {
    type: Number,
    unique: true,
    required: true
  },
  catchInfo: {
    isCaught: {
      type: Boolean,
      default: false
    },
    userId: { type: String },
    timestamp: { type: Date }
  }
});

PokemonSchema.methods.catch = function(userId) {
  this.catchInfo = {
    isCaught: true,
    userId: userId,
    timestamp: Date.now()
  };
  this.save();
};

module.exports = mongoose.model('Pokemon', PokemonSchema);