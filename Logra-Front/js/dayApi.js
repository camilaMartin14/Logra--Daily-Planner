const DayApi = {
    async obtenerOCrear(fecha) {
        return apiFetch(`/Dia/fecha/${fecha}`);
    },

    async actualizar(id, data) {
        return apiFetch(`/Dia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

