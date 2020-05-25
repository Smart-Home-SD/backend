const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  userType: {
    type: String,
    enum: ['ADMIN', 'USER'],
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
