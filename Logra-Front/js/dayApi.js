const DayApi = {
    async obtenerOCrear(fecha) {
        const token = localStorage.getItem('logra_token');
        if (!token) throw new Error("No hay token de usuario");

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (!userId) throw new Error("No se pudo extraer userId del token");

        return apiFetch(`/Dia/usuario/${userId}/fecha/${fecha}`);
    },

    async actualizar(id, data) {
        return apiFetch(`/Dia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

