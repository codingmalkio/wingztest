const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Booking } = require('../database/model.booking');

/* GET home page. */
router.get('/', async function (req, res, next) {
  // ensure that the bookings is in an array and in the correct format
  let bookings = [].concat(await Booking.findAll({ raw: true, plain: true }));
  bookings = bookings.map(booking => {
    return {
      ...booking,
      pickupLocation: JSON.parse(booking.pickupLocation),
      destination: JSON.parse(booking.destination),
      previewRoute: JSON.parse(booking.previewRoute)
    }
  });
  return res.json(bookings);
});

router.post('/', async function (req, res, next) {
  //  id: string, // Unique identifier for the ride
  //  userId: string, // ID of the user requesting the ride
  //  driverId: string | null, // ID of the driver accepting the ride (null if not accepted)
  //  pickupLocation: {
  //    latitude: number, // Latitude of the pickup location
  //    longitude: number, // Longitude of the pickup location
  //  },
  //  destination: {
  //    latitude: number, // Latitude of the destination
  //    longitude: number, // Longitude of the destination
  //  },
  //  status: 'pending' | 'accepted' | 'declined' | 'started' | 'picked-up' | 'dropped-off', // Status of the ride request
  //  pickupTime: Date, // Time when the ride is scheduled for pickup
  //  timestamp: Date, // Timestamp of when the ride request was made
  let payload = { ...req.body };
  payload.driverId = null;
  payload.status = 'pending'; // 'pending' | 'accepted' | 'declined' | 'started' | 'picked-up' | 'dropped-off', // Status of the ride request
  payload.pickupTime = null;
  payload.timestamp = Date.now();
  const booking = await Booking.create(payload);
  return res.json(payload);
});


module.exports = router;
