const fs = require('fs');
const path = require('path');

const models = ['Package', 'Itinerary', 'Ride', 'User', 'Staff', 'CompanyPolicy', 'Payment', 'Coupon', 'AddOn'];

models.forEach(model => {
    const varName = model.toLowerCase();

    // Controller
    const controllerCode = `const ${model} = require('../models/${model}');

exports.getAll = async (req, res) => {
    try {
        const data = await ${model}.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await ${model}.findById(req.params.id);
        if (data) res.json(data);
        else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = new ${model}(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedData = await ${model}.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        await ${model}.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
`;
    fs.writeFileSync(path.join(__dirname, 'controllers', varName + 'Controller.js'), controllerCode);

    // Route
    const routeCode = `const express = require('express');
const router = express.Router();
const controller = require('../controllers/${varName}Controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteRecord);

module.exports = router;
`;
    fs.writeFileSync(path.join(__dirname, 'routes', varName + 'Routes.js'), routeCode);
});

console.log('CRUD APIs generated!');
