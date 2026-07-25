document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cargar lista de roles desde la base de datos
    cargarRoles();

    // 2. Evento para guardar el usuario
    const btnGuardar = document.getElementById('btn_guardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre_completo = document.getElementById('nombre_usuario').value.trim();
            const correo_electronico = document.getElementById('correo_usuario').value.trim();
            const contrasena = document.getElementById('password_usuario').value.trim();
            const id_rol = document.getElementById('rol_usuario').value;
            const estatus = document.getElementById('estatus_usuario').value;

            // Validación local de campos obligatorios
            if (!nombre_completo || !correo_electronico || !contrasena || !id_rol) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = { id_rol, nombre_completo, correo_electronico, contrasena, estatus };

            fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'PanelUsuarios.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(err => console.error('Error al guardar:', err));
        });
    }
});

function cargarRoles() {
    fetch('http://localhost:3000/api/roles')
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const selectRol = document.getElementById('rol_usuario');
                selectRol.innerHTML = '<option value="">Seleccione un rol...</option>';
                
                datos.roles.forEach(rol => {
                    selectRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre_rol}</option>`;
                });
            }
        })
        .catch(err => console.error('Error al cargar roles:', err));
}