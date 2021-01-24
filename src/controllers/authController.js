const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { createToken } = require('../middlewares/auth');

// register a new user
const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create(req.body);

    //do not return password field
    user.password = undefined;

    // returns the new user and created token
    return res.status(201).send({ user, token: createToken(user) });

  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, ' ', password)
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).json({ error: 'Invalid password' });

    user.password = undefined;

    res.status(200).send({ user, token: createToken(user) });

  } catch (error) {
    res.status(400).json({ error: 'Error while trying to login' });
  }

};

module.exports = {
  registerUser,
  login
};