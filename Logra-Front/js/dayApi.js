import { apiFetch } from './api.js';

export const DayApi = {
    async obtenerOCrear(fecha) {
        try {
            return await apiFetch(`/days/${fecha}`);
        } catch (e) {
            return await apiFetch(`/days/today`);
        }
    },

    async actualizar(id, data) {
        return apiFetch(`/days/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

