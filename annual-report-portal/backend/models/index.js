import express from  'express';
import User from './signupSchema';
 // Import the User model
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Create a new user
    const newUser = new User({ username, email, password, date });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err.message });
  }
});

router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
