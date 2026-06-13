const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicationController');
const { protect, admin, adminOrStaff } = require('../middleware/authMiddleware');

router.post('/', controller.submitApplication);
router.get('/', protect, adminOrStaff, controller.getApplications);
router.put('/:id/hire', protect, adminOrStaff, controller.hireApplicant);
router.put('/:id/reject', protect, adminOrStaff, controller.rejectApplicant);

module.exports = router;
