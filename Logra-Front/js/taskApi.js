import { apiFetch } from './api.js';

export const TaskApi = {
    crear(diaId, text) {
        return apiFetch(`/tasks/day/${diaId}`, {
            method: 'POST',
            body: JSON.stringify({ description: text })
        });
    },

    listar(diaId) {
        return apiFetch(`/tasks/day/${diaId}`);
    },

    getByCategory(categoryId) {
        return apiFetch(`/tasks/category/${categoryId}`);
    },

    actualizar(id, data) {
        return apiFetch(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    eliminar(id) {
        return apiFetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
    },

    addCategory(id, categoryId) {
        return apiFetch(`/tasks/${id}/categories/${categoryId}`, {
            method: 'POST'
        });
    },

    removeCategory(id, categoryId) {
        return apiFetch(`/tasks/${id}/categories/${categoryId}`, {
            method: 'DELETE'
        });
    }
};
