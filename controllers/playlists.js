const User = require('../models/user.js');
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Song = require('../models/song')


router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      res.render('playlists/index.ejs', {
        playlist: currentUser.playlist,
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
      const newPlaylist = {
        name: req.body.name,
        songs: [],
      };
      currentUser.playlist.push(newPlaylist);
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/playlists`);
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  })

  router.delete('/:playlistId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      currentUser.playlist.id(req.params.playlistId).deleteOne();
      await currentUser.save();
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
  router.post('/', async (req, res) => {
    try {
      const playlist = new Playlist({ name: req.body.name });
      await playlist.save();
  
      const user = await User.findById(req.session.user._id);
      user.playlists.push(playlist);
      await user.save();
  
      res.redirect(`/users/${user._id}/playlists`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
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
      playlist.songs.push(song);
      await playlist.save();
  
      res.redirect(`/users/${req.session.user._id}/playlists/${playlist._id}`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });




module.exports = router;