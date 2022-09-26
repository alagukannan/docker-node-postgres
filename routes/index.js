// ./routes/index.js
const songs = require('./songs');

module.exports = app => {
  app.use('/songs', songs)
  // etc..
};