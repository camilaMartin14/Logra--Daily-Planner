async function login(email, password) {
    const result = await apiFetch('/Usuario/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            contrasenia: password
        })
    });

    setToken(result.token);
    return result.usuario;
}
async function register(data) {
    await apiFetch('/Usuario/registro', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
document.querySelector('#loginModal form')
  .addEventListener('submit', async e => {
    e.preventDefault();

    try {
        await login(loginEmail.value, loginPassword.value);
        location.reload();
    } catch (err) {
        alert(err.message);
    }
});
