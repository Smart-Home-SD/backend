import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const SALT_WORK_FACTOR = 5;

export const createUser = (req, res) => {
  if (req.body.username == null || req.body.username === '') {
    return res.status(400).json({ message: 'username is required on the body!' });
  }

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    userType: req.body.userType,
  };

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) throw err;

    // hash the password along with our new salt
    bcrypt.hash(newUser.password, salt, (errHash, hash) => {
      if (errHash) throw errHash;

      // override the cleartext password with the hashed one
      newUser.password = hash;
      User.create(newUser, (errUser, doc) => {
        const userInfo = {
          username: doc.username,
          userType: doc.userType,
          id: doc.id,
        };

        if (errUser) {
          console.log(err);
          res.status(400).json({
            Status: false,
            Error: err,
          });
        }

        res.status(200).json({
          Status: true,
          UserObject: userInfo,
        });
      });
    });
  });

  return null;
};

export const getUser = (req, res) => {
  const userId = req.params.id;
  User.findOne({ _id: userId }).select('_id username userType tokens').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc == null) {
      return res.status(404).json({ message: 'user not found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

export const getAllUsers = (req, res) => {
  User.find().select('_id username userType tokens').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc == null) {
      return res.status(404).json({ message: 'no user found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

export const deleteUser = (req, res) => {
  const userId = req.params.id;
  User.deleteOne({ _id: userId }, (err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc.deletedCount === 0) {
      return res.status(404).json({ message: 'user not found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

export const updateUser = async (req, res) => {
  try {
    const newUser = {
      id: req.body.id,
      username: req.body.username,
      password: req.body.password,
      userType: req.body.userType,
    };

    const user = await User.findOne({ _id: newUser.id });
    if (!user) {
      return res.status(400).json({ message: 'user not registered' });
    }

    bcrypt.compare(newUser.password, user.password, (err, result) => {
      if (err) return res.status(404).send({ error: err });

      if (!result) {
        bcrypt.genSalt(SALT_WORK_FACTOR, (errSalt, salt) => {
          if (errSalt) throw errSalt;

          // hash the password along with our new salt
          bcrypt.hash(newUser.password, salt, (errHash, hash) => {
            if (errHash) throw errHash;

            newUser.password = hash;

            User.updateOne({ _id: newUser.id }, newUser, (upErr) => {
              if (upErr) {
                return res.status(404).send({ error: upErr });
              }
              return res.status(200).json({ message: 'user updated!' });
            });
          });
        });
      }
      return res.status(400).send();
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
  return res.status(400).send();
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log('here');
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'user not registered' });
    }
    // console.log(user);
    // console.log(password);
    // console.log(user.password);
    bcrypt.compare(password, user.password, (err, result) => {
      // console.log(err);
      // console.log(result);
      if (!result) {
        return res.status(404).send({ message: 'invalid login credentials' });
      }

      if (!user) {
        return res.status(401).send({ message: 'login failed! Check authentication credentials' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
      return res.status(200).send({ user, token });
    });
    return res.status(400);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
