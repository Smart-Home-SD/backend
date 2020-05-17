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
    // lowercase: true,
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

// userSchema.pre('save', function callback(next) {
//   const user = this;

//   if (user.isModified('password') && user.isNew()) {
//     const salt = bcrypt.genSaltSync(saltRounds);
//     user.password = bcrypt.hashSync(user.password, salt);
//     next();
//   }
// });


const User = mongoose.model('User', userSchema);

module.exports = User;
