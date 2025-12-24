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


window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`button[onclick="togglePassword('${inputId}')"] i`);
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
};


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
            await register(data);
            alert('Registro exitoso. Por favor inicia sesión.');
            location.reload();
        } catch (err) {
            console.error('Register error:', err);
            alert(err.message);
        }
    });
}