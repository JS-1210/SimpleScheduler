import Appointment from '../models/appointment.model.js';
import Service from '../models/service.model.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { query, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';
import { getSmartAvailabilityUtil } from '../utils/smartScheduler.js';
import { addMinutes, isSameDay } from 'date-fns';

const getAvailableSlotsForService = (service, date) => {
    const availableSlots = [];
    let currentTime = new Date(date.setHours(9, 0, 0));

    while (currentTime.getHours() < 17) {
        const endTime = addMinutes(currentTime, service.durationMinutes);
        availableSlots.push({ startTime: currentTime, endTime, duration: service.durationMinutes });
        currentTime = endTime;
    }

    return availableSlots;
};

export const getAvailability = [
    query('date').isISO8601().toDate().withMessage('Invalid date format'),
    query('serviceId').isMongoId().withMessage('Invalid service ID'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Invalid query parameters', 400));
        }

        const { date, serviceId } = req.query;
        const service = await Service.findById(serviceId);

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        const slots = getAvailableSlotsForService(service, new Date(date));

        const bookedAppointments = await Appointment.find({
            serviceId,
            startTime: { $gte: new Date(date) },
            endTime: { $lte: addMinutes(new Date(date), 86400) }
        });

        const availableSlots = slots.filter(slot => {
            return !bookedAppointments.some(appointment =>
                isSameDay(appointment.startTime, slot.startTime) &&
                appointment.startTime.getTime() === slot.startTime.getTime());
        });

        res.json(availableSlots);
    }),
];

export const getSmartAvailability = [
    query('date').isISO8601().toDate().withMessage('Invalid date format'),
    query('serviceId').isMongoId().withMessage('Invalid service ID'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Invalid query parameters', 400));
        }

        const { date, serviceId } = req.query;
        const service = await Service.findById(serviceId);

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        const slots = getAvailableSlotsForService(service, new Date(date));

        const bookedAppointments = await Appointment.find({
            startTime: { $gte: new Date(date) },
            endTime: { $lte: addMinutes(new Date(date), 86400) }
        });

        const optimizedSlots = getSmartAvailabilityUtil(slots, bookedAppointments);
        res.json(optimizedSlots);
    }),
];
