import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import serviceRoutes from './routes/service.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import availabilityRoutes from './routes/availability.route.js';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './utils/errorHandler.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

app.use(globalErrorHandler);

export default app;
