import { apiFetch } from './api.js';

export const DayApi = {
    async getByDate(dateStr) {
        return await apiFetch(`/days/date/${dateStr}`);
    },

    async create(dateStr) {
        return await apiFetch('/days', {
            method: 'POST',
            body: JSON.stringify({ date: dateStr })
        });
    },

    async obtenerOCrear(dateStr) {
        try {
            return await this.getByDate(dateStr);
        } catch (e) {
            if (e.status === 404) {
                return await this.create(dateStr);
            }
            throw e;
        }
    },

    async update(id, data) {
        return apiFetch(`/days/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};
