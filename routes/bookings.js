const express = require('express');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { clearCache } = require('../middleware/cache');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('show');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { showId, seats } = req.body;
  try {
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    if (seats.length > show.availableSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    const totalAmount = seats.length * show.price;
    const convenienceFee = seats.length * 20;
    const booking = new Booking({
      show: showId,
      seats,
      totalAmount: totalAmount + convenienceFee,
      numberOfSeats: seats.length,
      convenienceFee: convenienceFee,
      discount: 0,
    });
    await booking.save();
    show.availableSeats -= seats.length;
    await show.save();
    
    // Clear shows cache since availability changed
    clearCache('/api/shows');
    
    res.json(booking);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'cancelled';
      await booking.save();
      const show = await Show.findById(booking.show);
      show.availableSeats += booking.seats.length;
      await show.save();
      
      // Clear shows cache since availability changed
      clearCache('/api/shows');
      
      res.json({ message: 'Booking cancelled and refunded' });
    } else {
      res.status(400).json({ message: 'Cannot cancel unpaid booking' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/pay', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.paymentStatus = 'paid';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
