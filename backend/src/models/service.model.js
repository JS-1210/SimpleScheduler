import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        available: { type: Boolean, default: true },
        durationMinutes: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
