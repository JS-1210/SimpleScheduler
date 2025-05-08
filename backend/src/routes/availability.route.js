import express from 'express';
import { getAvailability, getSmartAvailability } from '../controllers/availability.controller.js';

const router = express.Router();

router.get('/', getAvailability);

router.get('/smart', getSmartAvailability);

export default router;
