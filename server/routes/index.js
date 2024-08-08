var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.json([
    { id: 1, coordinate: { latitude: 7.086313, longitude: 125.612855 }, title: 'Davao City', description: 'City of Royalties' },
    { id: 2, coordinate: { latitude: 7.0667509868259515, longitude: 125.59637573846157 }, title: 'Davao City', description: 'City of Royalties' },
    { id: 3, coordinate: { latitude: 7.065347826608068, longitude: 125.60200927325728 }, title: 'Davao City', description: 'City of Royalties' },
  ]);
});


module.exports = router;
