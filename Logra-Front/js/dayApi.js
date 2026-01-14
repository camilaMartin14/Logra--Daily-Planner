import { apiFetch } from './api.js';

export const DayApi = {
    async getByDate(dateStr) {
        try {
            return await apiFetch(`/days/date/${dateStr}`);
        } catch (e) {
            console.error("Error fetching day by date", e);
            return await apiFetch(`/days/today`);
        }
    },

    async update(id, data) {
        return apiFetch(`/days/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};
