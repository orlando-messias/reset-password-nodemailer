const User = require('../models/User');

// register a new user
const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create(req.body);

    //do not return password field
    user.password = undefined;

    return res.send({ user });

  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Registration failed' });
  }
};

module.exports = {
  registerUser,
};