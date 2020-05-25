import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const SALT_WORK_FACTOR = 5;

export const createUser = (req, res) => {
  if (req.body.username == null || req.body.username === '') {
    return res.status(400).json({
      Status: 'false',
      Error: 'Username is required on the body!',
    });
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
      res.status(404).send({ error: err });
    }
    res.status(200).json(doc);
  });
  return null;
};

export const getAllUsers = (req, res) => {
  User.find().select('_id username userType tokens').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
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
    return res.status(200).json(doc);
  });
  return null;
};

export const updateUser = async (req, res) => {
  try {
    const {
      username, password, userType, id,
    } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not registered' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(404).send({ error: err });

      if (!result) {
        console.log('here!!!');
        bcrypt.genSalt(SALT_WORK_FACTOR, (errSalt, salt) => {
          if (errSalt) throw errSalt;

          // hash the password along with our new salt
          bcrypt.hash(password, salt, (errHash, hash) => {
            if (errHash) throw errHash;
            user.password = hash;
          });
        });
      }
    });

    if (username !== user.username) user.username = username;
    if (userType !== user.userType) user.userType = userType;
    User.updateOne({ _id: id }, user, (err) => {
      if (err) {
        return res.status(404).send({ error: err });
      }
      return res.status(200).json({ message: 'user updated!' });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log('here');
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('No user registered');
    }
    // console.log(user);
    // console.log(password);
    // console.log(user.password);
    bcrypt.compare(password, user.password, (err, result) => {
      // console.log(err);
      // console.log(result);
      if (!result) {
        throw new Error('Invalid login credentials');
      }

      if (!user) {
        return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
      return res.send({ user, token });
    });
    return res.status(400);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
