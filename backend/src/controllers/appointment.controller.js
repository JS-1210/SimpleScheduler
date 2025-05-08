import Appointment from '../models/appointment.model.js';
import Service from '../models/service.model.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';
import { startOfMinute } from 'date-fns'; // ✅ Make sure this is imported

export const getAllAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find().populate('serviceId', 'name');
    res.json(appointments);
});

export const createAppointment = [
    body('serviceId').isMongoId().withMessage('Invalid service ID').trim(),
    body('customerName').isString().trim().escape().withMessage('Customer name should be a valid string'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('startTime').isISO8601().toDate().withMessage('Invalid start time'),
    body('endTime').isISO8601().toDate().withMessage('Invalid end time'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Invalid input data', 400));
        }

        const { serviceId, customerName, customerEmail } = req.body;
        let { startTime, endTime } = req.body; // ✅ Use `let`, not `const`, if you're reassigning

        const service = await Service.findById(serviceId);
        if (!service) {
            return next(new AppError('Service not found', 404));
        }
        startTime = startOfMinute(new Date(startTime));
        endTime = startOfMinute(new Date(endTime));

        const existingAppointment = await Appointment.findOne({
            serviceId,
            $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gt: startTime } },
            ],
        });

        if (existingAppointment) {
            return next(new AppError('The time slot is already booked', 400));
        }

        const appointment = await Appointment.create({
            serviceId,
            customerName,
            customerEmail,
            startTime,
            endTime,
        });

        res.status(201).json(appointment);
    }),
];
