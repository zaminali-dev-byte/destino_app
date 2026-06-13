const express = require('express');
const router = express.Router();
const controller = require('../controllers/complaintController');
const { protect, admin, adminOrStaff } = require('../middleware/authMiddleware');

router.get('/', protect, adminOrStaff, controller.getComplaints);
router.get('/my', protect, controller.getMyComplaints);
router.post('/', protect, controller.createComplaint);
router.put('/:id', protect, adminOrStaff, controller.updateComplaint);
router.delete('/:id', protect, admin, controller.deleteComplaint);

module.exports = router;
