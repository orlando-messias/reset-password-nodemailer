const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { createToken } = require('../middlewares/auth');
const mailer = require('../modules/mailer');

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
    return res.status(400).send({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
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

const forgot_password = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user._id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });

    mailer.sendMail({
      to: email,
      from: 'orlando@gmail.com',
      template: 'auth/forgot',
      context: { token }
    }, (err) => {
      if (err) return res.status(400).send({ error: 'Cannot send forgot password email' });

      return res.send();
    });

  } catch (error) {
    res.status(400).json({ error: 'Error on forgot password.' });
  }
};

const reset_password = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if (!user) return res.status(400).send({ error: 'User not found' });

    if (token !== user.passwordResetToken)
      res.status(400).json({ error: 'Invalid token' });

    const now = new Date();
    if (now > user.passwordResetExpires)
      res.status(400).json({ error: 'Token expired, generate a new one' });
    
    user.password = password;

    await user.save();

    res.send();

  } catch (error) {
    res.status(400).json({ error: 'Error on reseting password.' });
  }
};

module.exports = {
  registerUser,
  login,
  forgot_password,
  reset_password
};