const express = require('express');
const Show = require('../models/Show');
const auth = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// Cache shows list for 5 minutes (300 seconds)
router.get('/', cacheMiddleware(300), async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cache individual show for 10 minutes (600 seconds)
router.get('/:id', cacheMiddleware(600), async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { title, description, date, time, venue, totalSeats, price } = req.body;
  try {
    const show = new Show({
      title,
      description,
      date,
      time,
      venue,
      totalSeats,
      availableSeats: totalSeats,
      price,
    });
    await show.save();
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;