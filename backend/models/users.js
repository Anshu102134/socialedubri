const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // ✅ list of friends
    },
  ],
  
}, { timestamps: true });

const User = mongoose.models.users || mongoose.model('users', userSchema);

module.exports = User;
