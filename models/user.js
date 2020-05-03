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

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  }

});

userSchema.pre('updateOne', function (next) {
  const user = this;

  if (user._update.password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    user._update.password = bcrypt.hashSync(user.password, salt);
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
