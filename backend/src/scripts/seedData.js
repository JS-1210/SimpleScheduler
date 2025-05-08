import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/service.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const services = [
    { name: "Haircut", price: 35.00, durationMinutes: 30 },
    { name: "Consultation", price: 100.00, durationMinutes: 60 },
    { name: "Massage", price: 65.00, durationMinutes: 45 },
    { name: "Quick Repair", price: 40.00, durationMinutes: 20 }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Service.deleteMany();

        await Service.insertMany(services);
        console.log('Seed data inserted');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error while seeding the database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();
