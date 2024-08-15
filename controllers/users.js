const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const Playlist = require('../models/playlist')

// Sign-up
router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }
    
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    
    const newPlaylist = await Playlist.create({ name: req.body.username + "'s Playlist" });
    req.body.playlist = newPlaylist._id;
    await User.create(req.body);
    
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Sign-in
router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
    
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
    
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
    
    res.redirect('/');
  } catch (error) {
    res.redirect('/');
  }
});

// Index
router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.render('users/index.ejs', { allUsers });
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
});

// Show
router.get('/:userId', async (req, res) => {
  try {
    const pageOwner = await User.findById(req.params.userId);
    res.render('users/show.ejs', {
      pageOwner
    });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

module.exports = router;