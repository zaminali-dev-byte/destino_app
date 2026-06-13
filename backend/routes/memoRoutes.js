const express = require('express');
const router = express.Router();
const { getMemos, createMemo, deleteMemo } = require('../controllers/memoController');
const { protect, adminOrStaff } = require('../middleware/authMiddleware');

router.use(protect); // All memo routes require authentication

router.get('/', adminOrStaff, getMemos);
router.post('/', adminOrStaff, createMemo);
router.delete('/:id', adminOrStaff, deleteMemo);

module.exports = router;
