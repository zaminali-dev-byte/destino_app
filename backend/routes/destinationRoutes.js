const express = require('express');
const router = express.Router();
const { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination } = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.get('/:id', getDestinationById);

router.post('/', protect, admin, createDestination);
router.put('/:id', protect, admin, updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
