const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.post('/', payrollController.processPayroll);
router.get('/', payrollController.getPayroll);

module.exports = router;
