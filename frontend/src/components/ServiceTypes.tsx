import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Service {
    _id?: string;
    name: string;
    price: number;
    durationMinutes: number;
}

const ServiceTypes: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [formData, setFormData] = useState<Service>({
        name: '',
        price: 0,
        durationMinutes: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) return toast.error('Name is required');
        if (formData.price <= 0) return toast.error('Price must be greater than 0');
        if (formData.durationMinutes <= 0) return toast.error('Duration must be greater than 0');

        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newService = await response.json();
                setServices(prev => [...prev, newService]);
                toast.success('Service added successfully!');
                setFormData({ name: '', price: 0, durationMinutes: 0 });
            } else {
                toast.error('Failed to add service');
            }
        } catch (err) {
            console.error('Submission error:', err);
            toast.error('An error occurred');
        }
    };

    return (
        <div>
            <Toaster />
            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Service Types</h2>

            {loading ? (
                <p>Loading services...</p>
            ) : (
                <ul className="serviceList">
                    {services.map(service => (
                        <li key={service._id} className="serviceItem">
                            <strong>{service.name}</strong> — ${service.price} — {service.durationMinutes} mins
                        </li>
                    ))}
                </ul>
            )}

            <h3 style={{ marginBottom: '1rem', marginTop: '2rem', fontSize: '1.5rem' }}>Add New Service</h3>
            <form onSubmit={handleSubmit} className="serviceForm">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Service name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <label htmlFor="price">Price ($)</label>
                <input
                    type="text"
                    id="price"
                    inputMode="decimal"
                    pattern="^\d+(\.\d{1,2})?$"
                    placeholder="Price in dollars"
                    value={formData.price === 0 ? '' : formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                />

                <label htmlFor="duration">Duration (minutes)</label>
                <input
                    type="text"
                    id="duration"
                    inputMode="numeric"
                    pattern="\d+"
                    placeholder="Duration in minutes"
                    value={formData.durationMinutes === 0 ? '' : formData.durationMinutes}
                    onChange={e =>
                        setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })
                    }
                    required
                />

                <button type="submit">Add Service</button>
            </form>
        </div>
    );
};

export default ServiceTypes;
