const express = require('express');
const router = express.Router();
const controller = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: validate a coupon code + order amount
router.post('/validate', controller.validateCoupon);

// Public read (for admin display)
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin only: create / update / delete
router.post('/', protect, admin, controller.create);
router.put('/:id', protect, admin, controller.update);
router.delete('/:id', protect, admin, controller.deleteRecord);

module.exports = router;
