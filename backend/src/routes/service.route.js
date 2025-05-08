import express from 'express';
import {
    getAllServices,
    createService
} from '../controllers/service.controller.js';

const router = express.Router();

router.get('/', getAllServices);

router.post('/', createService);

export default router;
