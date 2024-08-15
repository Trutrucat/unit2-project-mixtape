const User = require('../models/user.js');
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Song = require('../models/song')


router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id).populate({
        path: 'playlist',
        populate: {
          path: 'songs'
        }
        });
      res.render('playlists/index.ejs', {
        playlist: currentUser.playlist,
        user: currentUser,
      });
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  });

router.get('/new', (req, res) => {
    res.render('playlists/new.ejs',{ user: req.session.user })  
});

router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const newPlaylist = new Playlist({
      name: req.body.name,
      songs: [] 
    });
    await newPlaylist.save();

    currentUser.playlists.push(newPlaylist._id);
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/playlists`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

  router.delete('/:playlistId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      currentUser.playlists.pull(req.params.playlistId);
      await currentUser.save();
      await Playlist.findByIdAndDelete(req.params.playlistId);
      res.redirect(`/users/${currentUser._id}/playlists`);
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  });

router.get('/:playlistId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const playlist = currentUser.playlist.id(req.params.playlistId);
      res.render('playlists/edit.ejs', {
        playlist: playlist,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  });

router.put('/:playlistId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const playlist = currentUser.playlist.id(req.params.playlistId);
      playlist.set(req.body);
      await currentUser.save();
      res.redirect(
        `/users/${currentUser._id}/playlists/`
      );
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  });
  // router.post('/', async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  //     const { title, artist, genre, decade } = req.body;
  //     const user = await User.findById(userId);
  
  //     if (!user) {
  //       return res.status(404).send('User not found');
  //     }
  //     let playlist = user.playlists[0];
  
  //     if (!playlist) {
  //       playlist = new Playlist({ songs: [] });
  //       await playlist.save();
  //       user.playlists.push(playlist);
  //     }
  //     playlist.songs.push({ title, artist, genre, decade });
  //     await playlist.save();
  
  //     await user.save();
  
  //     res.redirect(`/users/${userId}/playlists`);
  //   } catch (error) {
  //     console.log(error);
  //     res.redirect('/');
  //   }
  // });
  
  router.get('/:playlistId/songs/new', async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.playlistId);
      res.render('songs/new', { playlist });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
  router.post('/:playlistId/songs', async (req, res) => {
    try {
      const song = new Song(req.body);
      await song.save();
  
      const playlist = await Playlist.findById(req.params.playlistId);
      playlist.songs.push(song._id);
      await playlist.save();
  
      res.redirect(`/users/${req.session.user._id}/playlists/${playlist._id}`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });




module.exports = router;