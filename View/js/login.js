document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form_login');
    const mensajeError = document.getElementById('mensaje_error');

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Limpiamos errores previos
        mensajeError.style.display = 'none';

        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();

        // Validamos que no estén vacíos (por si el required de HTML falla)
        if (!correo || !contrasena) {
            mostrarError('Por favor, ingrese su correo y contraseña.');
            return;
        }

        const credenciales = { correo, contrasena };

        // Consumimos la API
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                // Guardamos los datos del usuario en la memoria del navegador
                // Esto nos servirá para saber quién está logueado en las demás páginas
                sessionStorage.setItem('usuario_marriott', JSON.stringify(datos.usuario));
                
                // Redirigimos al panel principal
                window.location.href = 'Panel.html';
            } else {
                // Credenciales incorrectas o cuenta inactiva
                mostrarError(datos.mensaje);
            }
        })
        .catch(err => {
            console.error('Error de conexión:', err);
            mostrarError('Error de conexión con el servidor. Intente más tarde.');
        });
    });

    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
});