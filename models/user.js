const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
