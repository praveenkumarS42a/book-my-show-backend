const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  seats: [{
    type: String,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'upi', 'wallet', 'net-banking'],
  },
  transactionId: {
    type: String,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  convenienceFee: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
