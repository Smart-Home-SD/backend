const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 5;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['ADMIN', 'USER'],
  },
});

userSchema.pre('save', (next) => {
  const user = this;

  if (user.isModified('password')) {
    const salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(user.password,salt);
    next();
  }
});

userSchema.pre('updateOne', (next) => {
  const user = this;

  if (user.isModified('password')) {
    const salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(user.password,salt);
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
