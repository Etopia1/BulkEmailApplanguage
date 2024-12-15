const User = require('../models/userModel');
const generateToken = require('../middlewares/genera');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already exists');

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).send('Error registering user');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid email or password');

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).send('Error logging in');
  }
};
