const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, controller.getAll);
router.get('/my', protect, controller.getPersonal);
router.get('/:id', protect, admin, controller.getById);

router.post('/', protect, controller.create);
router.put('/:id', protect, admin, controller.update);
router.delete('/:id', protect, admin, controller.deleteRecord);

module.exports = router;
