const express = require('express');
const router = express.Router();
const controller = require('../controllers/staffController');

const { protect, adminOrStaff } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOrStaff, controller.getStats);
router.get('/activity', protect, adminOrStaff, controller.getActivity);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteRecord);

module.exports = router;
