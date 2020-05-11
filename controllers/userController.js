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

  console.log(req.body);
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
      User.create(newUser, (err, doc) => {
        const userInfo = {
          username: doc.username,
          userType: doc.userType,
          id: doc.id,
        };

        if (err) {
          console.log(err);
          res.status(400).json({
            Status: false,
            Error: err,
          });
        }
        console.log(doc);
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
  User.findOne({ _id: userId }, (err, doc) => {
    if (err) {
      res.status(404).send({ error: err });
    }
    res.status(200).send(doc);
  });
  return null;
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('here');
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('No user registered');
    }
    console.log(user);
    console.log(password);
    console.log(user.password);
    bcrypt.compare(password, user.password, (err, result) => {
      console.log(result);
      if (!result) {
        throw new Error('Invalid login credentials');
      }

      if (!user) {
        return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
      return res.send({ user, token });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
