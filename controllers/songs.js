const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Song = require('../models/song');

router.post('/', async (req, res) => {
  try {
    const { title, artist, genre, decade, playlistId } = req.body;
    const newSong = new Song({ title, artist, genre, decade });
    await newSong.save();

    const playlist = await Playlist.findById(req.session.user.playlist);
    playlist.songs.push(newSong._id);
    await playlist.save();

    res.redirect(`/users/${req.session.user._id}/playlists`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:songId/edit', async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    res.render('songs/edit.ejs', { song });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:songId', async (req, res) => {
  try {
    const { title, artist, genre, decade } = req.body;
    const song = await Song.findById(req.params.songId);
    song.title = title;
    song.artist = artist;
    song.genre = genre;
    song.decade = decade;
    await song.save();
    
    res.redirect(`/users/${req.session.user._id}/playlists`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:songId', async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.songId);

    const playlists = await Playlist.find({ 'songs': req.params.songId });
    playlists.forEach(async playlist => {
      playlist.songs.pull(req.params.songId);
      await playlist.save();
    });

    res.redirect(`/users/${req.session.user._id}/playlists`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;

