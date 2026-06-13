const express = require('express');
const router = express.Router();
const controller = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', protect, admin, controller.create);
router.put('/:id', protect, admin, controller.update);
router.delete('/:id', protect, admin, controller.deleteRecord);

module.exports = router;
