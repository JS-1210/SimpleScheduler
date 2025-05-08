import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
    {
        timestamps: true
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
