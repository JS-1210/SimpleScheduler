import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import toast, { Toaster } from "react-hot-toast";

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Service {
    _id?: string;
    name: string;
    price: number;
    durationMinutes: number;
}

interface Appointment {
    startTime: string;
    endTime: string;
    serviceId?: Service;
}

const Availability: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [weekStart, setWeekStart] = useState(dayjs().weekday(1));
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);

    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("/api/services");
                setServices(res.data);
                if (res.data.length) {
                    setSelectedServiceId(res.data[0]._id!);
                }
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedServiceId) {
            const from = weekStart.startOf("day").toISOString();
            const to = weekStart.add(6, "day").endOf("day").toISOString();
            axios
                .get("/api/appointments", {
                    params: { serviceId: selectedServiceId, from, to },
                })
                .then((res) => setAppointments(res.data))
                .catch((err) => console.error("Error fetching appointments:", err));
        }
    }, [selectedServiceId, weekStart]);

    useEffect(() => {
        if (selectedSlot) {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

            setTimeout(() => {
                const nameInput = document.getElementById("name") as HTMLInputElement;
                if (nameInput) nameInput.focus();
            }, 300);
        }
    }, [selectedSlot]);

    const isSlotBooked = (start: string, end: string) => {
        return appointments
            .filter((appt) => appt.serviceId?._id === selectedServiceId)
            .some(
                (appt) =>
                    dayjs(appt.startTime).isSame(start, "minute") &&
                    dayjs(appt.endTime).isSame(end, "minute")
            );
    };

    const handleSlotClick = (startTime: string, endTime: string) => {
        setSelectedSlot({ startTime, endTime });
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !name.trim() || !email.trim()) return;

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
            setSuccess(true);

            const from = weekStart.startOf("day").toISOString();
            const to = weekStart.add(6, "day").endOf("day").toISOString();
            const res = await axios.get("/api/appointments", {
                params: { serviceId: selectedServiceId, from, to },
            });
            setAppointments(res.data);
        } catch (err) {
            toast.error("Error booking appointment");
            console.error("Booking error:", err);
        }
    };

    const renderTimeGrid = () => {
        const service = services.find((s) => s._id === selectedServiceId);
        if (!service) return null;

        const duration = service.durationMinutes;
        const startHour = 9;
        const endHour = 17;

        const timeSlots = [];
        let current = new Date();
        current.setHours(startHour, 0, 0, 0);
        const end = new Date();
        end.setHours(endHour, 0, 0, 0);

        while (current.getTime() + duration * 60000 <= end.getTime()) {
            const hour = current.getHours();
            const minute = current.getMinutes();
            timeSlots.push({ hour, minute });

            current = new Date(current.getTime() + duration * 60000);
        }

        return timeSlots.map(({ hour, minute }) => (
            <tr key={`${hour}-${minute}`}>
                <td>{dayjs().hour(hour).minute(minute).format("h:mm A")}</td>
                {Array.from({ length: 7 }).map((_, d) => {
                    const start = weekStart.add(d, "day").hour(hour).minute(minute).second(0);
                    const end = start.add(duration, "minute");

                    const isPast = dayjs().isAfter(start);
                    const booked = isSlotBooked(start.toISOString(), end.toISOString());

                    const status = isPast ? "gray" : booked ? "red" : "green";
                    const colorMap: Record<string, string> = {
                        gray: "#ccc",
                        red: "#f44336",
                        green: "#a5d6a7",
                    };

                    return (
                        <td
                            key={d}
                            style={{
                                backgroundColor: colorMap[status],
                                cursor: status === "green" ? "pointer" : "default",
                                textAlign: "center",
                            }}
                            onClick={() => {
                                if (status === "green") {
                                    handleSlotClick(start.toISOString(), end.toISOString());
                                }
                            }}
                        >
                            {status === "red" ? "Booked" : status === "gray" ? "Unavailable" : "Available"}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Toaster />
            <h2>Weekly Availability</h2>

            <div style={{ marginBottom: "1rem" }}>
                <label>Service:</label>
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                    {services.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.name} - ₹{s.price}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setWeekStart(weekStart.subtract(7, "day"))}>← Previous</button>
                <span style={{ margin: "0 1rem" }}>
                    Week of {weekStart.format("MMM D")}
                </span>
                <button onClick={() => setWeekStart(weekStart.add(7, "day"))}>Next →</button>
            </div>

            <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Time</th>
                        {Array.from({ length: 7 }).map((_, d) => (
                            <th key={d}>{weekStart.add(d, "day").format("ddd, MMM D")}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderTimeGrid()}</tbody>
            </table>

            {/* Form section */}
            {selectedSlot && (
                <div ref={formRef} style={{ marginTop: "2rem" }}>
                    <form onSubmit={handleSubmit}>
                        <h3>Book Slot</h3>
                        <p>
                            <strong>Selected:</strong>{" "}
                            {dayjs(selectedSlot.startTime).format("ddd, MMM D • h:mm A")}
                        </p>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Book</button>
                        {success && <p style={{ color: "green" }}>Booking successful!</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default Availability;
