const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  genre: {
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy', 'Musical', 'Adventure'],
    default: 'Drama',
  },
  language: {
    type: String,
    default: 'English',
  },
  duration: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
    enum: ['U', 'UA', 'A', 'R', 'PG', 'PG-13'],
    default: 'UA',
  },
  cast: [{
    type: String,
  }],
  director: {
    type: String,
  },
  posterUrl: {
    type: String,
  },
  trailerUrl: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  screen: {
    type: String,
    default: 'Screen 1',
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D',
  },
  status: {
    type: String,
    enum: ['upcoming', 'now-showing', 'ended'],
    default: 'now-showing',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Show', showSchema);