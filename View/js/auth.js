// 1. Verificar si hay datos de sesión guardados
const usuarioSesion = sessionStorage.getItem('usuario_marriott');

// 2. Si no hay sesión, expulsar inmediatamente reemplazando el historial para no poder volver con la flecha "Atrás"
if (!usuarioSesion) {
    window.location.replace('index.html');
} else {
    // 3. Validar permisos: Evitar que un Huésped entre al panel administrativo
    const usuario = JSON.parse(usuarioSesion);
    
    if (usuario.nombre_rol === 'Huésped') {
        sessionStorage.removeItem('usuario_marriott');
        alert('Acceso denegado. Este panel es exclusivo para personal del hotel.');
        window.location.replace('index.html');
    }
}

// 4. Función global para cerrar sesión de manera segura
function cerrarSesion(evento) {
    if (evento) evento.preventDefault(); // Evita que el <a> recargue la página por defecto
    
    // Destruimos el "gafete" del usuario
    sessionStorage.removeItem('usuario_marriott');
    
    // Lo mandamos al inicio
    window.location.replace('index.html');
}