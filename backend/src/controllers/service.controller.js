import Service from '../models/service.model.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';

export const createService = [
    body('name').isString().trim().escape().withMessage('Name is required and should be a valid string'),
    body('price').isNumeric().withMessage('Price should be a valid number'),
    body('durationMinutes').isInt({ min: 1 }).withMessage('Duration should be a valid integer greater than 0'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Invalid input data', 400));
        }

        const { name, price, available, durationMinutes } = req.body;
        const service = await Service.create({ name, price, available, durationMinutes });

        res.status(201).json(service);
    }),
];

export const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find();
    res.json(services);
});
