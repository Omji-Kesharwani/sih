const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Email validation regex
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Password should have a minimum length
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare passwords for login purposes

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
