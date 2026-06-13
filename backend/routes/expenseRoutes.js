const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', expenseController.addExpense);
router.get('/', expenseController.getExpenses);
router.get('/my', protect, expenseController.getMyExpenses);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
