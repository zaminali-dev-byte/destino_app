const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, controller.getStats);
router.get('/notifications', protect, admin, controller.getNotifications);
router.put('/notifications/:id/read', protect, admin, controller.markNotificationRead);

module.exports = router;
