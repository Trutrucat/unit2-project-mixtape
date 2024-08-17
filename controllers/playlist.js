const User = require('../models/user.js');
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist.js');
const Song = require('../models/song.js')


router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id).populate({
        path: 'playlist',
        populate: {
          path: 'songs'
        }
        });
        console.log(currentUser)
        if (!currentUser.playlist) {
          return res.send('No playlist found for this user.');
        }
      res.render('playlists/index.ejs', {
        playlist: currentUser.playlist,
        user: currentUser,
      });
    } catch (error) {
      res.redirect('/')
    }
  });

router.get('/new', (req, res) => {
    res.render('playlists/new.ejs',{ user: req.session.user })  
});

router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const playlist = await Playlist.findById(currentUser.playlist);
    console.log('Request Body for New Song:', req.body)

    const newSong = new Song(req.body);
    await newSong.save();
    console.log('New Song:', newSong)

    playlist.songs.push(newSong._id);
    await playlist.save();
    console.log('Updated Playlist:', newPlaylist)

    res.redirect(`/users/${currentUser._id}/playlists`);
  } catch (error) {
    res.redirect('/');
  }
});

router.delete('/:songId', async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.songId);

    const playlists = await Playlist.find({ 'songs': req.params.songId });
    playlists.forEach(async (playlist) => {
      playlist.songs.pull(req.params.songId);
      await playlist.save();
    });

    res.redirect(`/users/${req.session.user._id}/playlists`);
  } catch (error) {
    res.redirect('/');
  }
});


router.get('/:playlistId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const playlist = await Playlist.findById(currentUser.playlist);
      res.render('playlists/edit.ejs', {
        playlist: playlist,
      });
    } catch (error) {
      res.redirect('/')
    }
  });

router.put('/:playlistId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const playlist = await Playlist.findById(currentUser.playlistId);
      playlist.set(req.body);
      await playlist.save();
      res.redirect(
        `/users/${currentUser._id}/playlists/`
      );
    } catch (error) {
      res.redirect('/')
    }
  });
  
  router.get('/:songId/edit', async (req, res) => {
    try {
      const song = await Song.findById(req.params.songId);
      res.render('songs/edit.ejs', { song });
    } catch (error) {
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
      res.redirect('/');
    }
  });




module.exports = router;