const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  decade: {
    type: String,
    required: true,
  }
})

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlist: [playlistSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;