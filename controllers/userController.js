const User = require('../models/user');

exports.create = (req, res) => {
  console.log('/user/create');

  if (req.body.username == null || req.body.username === '') {
    return res.status(400).json({
      Status: 'false',
      Error: 'Username is required on the body!',
    });
  }
  if (req.body.password == null || req.body.password === '') {
    return res.status(400).json({
      Status: 'false',
      Error: 'Password is required on the body!',
    });
  }
  if (req.body.userType == null || req.body.userType === '') {
    return res.status(400).json({
      Status: 'false',
      Error: 'User Type is required on the body!',
    });
  }

  User.create(req.body, (err, doc) => {

    const userInfo = {
      username: doc.username,
      userType: doc.userType,
      id: doc.id,
    };

    if (err) {
      res.status(400).json({
        Status: false,
        Error: err,
      });
    } else {
      res.status(200).json({
        Status: true,
        UserObject: userInfo,
      });
    }
  });

};
