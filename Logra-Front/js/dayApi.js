import { apiFetch } from './api.js';

export const DayApi = {
    async obtenerOCrear(fecha) {
        return apiFetch(`/days/today`);
    },

    async actualizar(id, data) {
        return apiFetch(`/days/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

