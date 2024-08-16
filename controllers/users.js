const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const Playlist = require('../models/playlist')

// router.post('/sign-up', async (req, res) => {
//   try {
//     const newUser = new User({
//       username: req.body.username,
//       password: req.body.password,
  
//     });

//     const savedUser = await newUser.save();
//     const newPlaylist = new Playlist({
//       name: 'My Playlist',
//       songs: [],
//       user: savedUser._id, 
//     });

//     const savedPlaylist = await newPlaylist.save();

//     savedUser.playlist = savedPlaylist._id;
//     await savedUser.save();
//     res.redirect('/');
//   } catch (error) {
//     console.log(error);
//     res.redirect('/sign-up');
//   }
// });

// router.post('/sign-in', async (req, res) => {
//   try {
//     const userInDatabase = await User.findOne({ username: req.body.username });
//     if (!userInDatabase) {
//       return res.send('Login failed. Please try again.');
//     }
    
//     const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
//     if (!validPassword) {
//       return res.send('Login failed. Please try again.');
//     }
    
//     req.session.user = {
//       username: userInDatabase.username,
//       _id: userInDatabase._id
//     };
    
//     res.redirect('/');
//   } catch (error) {
//     res.redirect('/');
//   }
// });

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