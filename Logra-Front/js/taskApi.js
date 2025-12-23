const TaskApi = {
    crear(diaId, text) {
        return apiFetch(`/dias/${diaId}/tareas`, {
            method: 'POST',
            body: JSON.stringify({ descripcion: text })
        });
    },

    listar(diaId) {
        return apiFetch(`/dias/${diaId}/tareas`);
    },

    actualizar(id, data) {
        return apiFetch(`/tareas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    eliminar(id) {
        return apiFetch(`/tareas/${id}`, {
            method: 'DELETE'
        });
    }
};
