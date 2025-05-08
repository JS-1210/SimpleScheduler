import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./BookAppointment.css";

interface Service {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
}

interface Slot {
    startTime: string;
    endTime: string;
}

const BookAppointment: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [isSmart, setIsSmart] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        axios
            .get("/api/services")
            .then((res) => setServices(res.data))
            .catch(() => toast.error("Failed to load services"));
    }, []);

    useEffect(() => {
        if (selectedDate && selectedServiceId) {
            const url = isSmart
                ? `/api/availability/smart?date=${selectedDate}&serviceId=${selectedServiceId}`
                : `/api/availability?date=${selectedDate}&serviceId=${selectedServiceId}`;

            axios
                .get(url)
                .then((res) => setSlots(res.data))
                .catch(() => toast.error("Error loading slots"));
        } else {
            setSlots([]);
            setSelectedSlot(null);
        }
    }, [selectedDate, selectedServiceId, isSmart]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedServiceId || !selectedSlot || !name.trim() || !email.trim()) {
            toast.error("Please fill all fields and select a slot.");
            return;
        }

        try {
            await axios.post("/api/appointments", {
                serviceId: selectedServiceId,
                customerName: name,
                customerEmail: email,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
            });

            toast.success("Appointment booked successfully!");
            setName("");
            setEmail("");
            setSelectedSlot(null);

            const url = isSmart
                ? `/api/availability/smart?date=${selectedDate}&serviceId=${selectedServiceId}`
                : `/api/availability?date=${selectedDate}&serviceId=${selectedServiceId}`;

            const res = await axios.get(url);
            setSlots(res.data);
        } catch {
            toast.error("Error booking appointment");
        }
    };

    return (
        <div>
            <Toaster />
            <h2 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>Book an Appointment</h2>

            <form onSubmit={handleSubmit} className="serviceForm">
                <label htmlFor="service">Service</label>
                <select
                    id="service"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="input"
                    required
                >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                        <option key={service._id} value={service._id}>
                            {service.name} - ${service.price} - {service.durationMinutes} mins
                        </option>
                    ))}
                </select>

                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    className="input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                />

                <div className="smart-toggle">
                    <label>Use Smart Scheduling?</label>
                    <input
                        type="checkbox"
                        checked={isSmart}
                        onChange={() => setIsSmart(!isSmart)}
                    />
                </div>

                {slots.length > 0 && (
                    <>
                        <p><strong>Available Slots:</strong></p>
                        <div className="slots-container">
                            {slots.map((slot, idx) => {
                                const isSelected = selectedSlot?.startTime === slot.startTime;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`slot-button ${isSelected ? "selected" : ""}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {new Date(slot.startTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {selectedSlot && (
                    <>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button type="submit">Book Appointment</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default BookAppointment;
