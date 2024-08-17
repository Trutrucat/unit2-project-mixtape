const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const Playlist = require('../models/playlist')

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.render('users/index.ejs', { allUsers });
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const pageOwner = await User.findById(req.params.userId);
    const playlist = await Playlist.findOne({ user: pageOwner._id }).populate('songs');
    res.render('users/show.ejs', {
      pageOwner,
      playlist
    });
  } catch (error) {
    res.redirect('/')
  }
});

module.exports = router;