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
// Login Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            console.log('Attempting login for:', email);
            const usuario = await login(email, password);
            console.log('Login success:', usuario);

            if (usuario && usuario.nombre) {
                localStorage.setItem('logra_user_name', usuario.nombre);
            } else {
                 localStorage.setItem('logra_user_name', 'Usuario');
            }
            location.reload();
        } catch (err) {
            console.error('Login error:', err);
            alert(err.message);
        }
    });
}

// Register Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async e => {
        e.preventDefault();
        console.log('Register form submitted');

        const nombre = document.getElementById('regName').value;
        const apellido = document.getElementById('regSurname').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const data = {
            nombre,
            apellido,
            email,
            contrasenia: password
        };

        try {
            console.log('Attempting register for:', email);
            await register(data);
            console.log('Register success');
            alert('Registro exitoso. Por favor inicia sesión.');
            location.reload();
        } catch (err) {
            console.error('Register error:', err);
            alert(err.message);
        }
    });
}
