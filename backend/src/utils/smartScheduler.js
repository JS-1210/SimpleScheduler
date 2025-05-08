import dayjs from 'dayjs';

const getDuration = (start, end) => dayjs(end).diff(dayjs(start), 'minute');

export const getSmartAvailabilityUtil = (slots, appointments) => {
    const scoredSlots = slots.map((slot) => {
        let score = 0;
        const { startTime, endTime, duration } = slot;

        const before = appointments.find(appt => {
            return (
                dayjs(appt.endTime).isSame(dayjs(startTime)) &&
                getDuration(appt.startTime, appt.endTime) === duration
            );
        });

        const after = appointments.find(appt => {
            return (
                dayjs(appt.startTime).isSame(dayjs(endTime)) &&
                getDuration(appt.startTime, appt.endTime) === duration
            );
        });

        if (before) score += 1;
        if (after) score += 1;

        return { ...slot, score };
    });

    const filtered = scoredSlots.filter(slot => slot.score > 0);
    return filtered.length > 0 ? filtered.sort((a, b) => b.score - a.score) : scoredSlots;
};
