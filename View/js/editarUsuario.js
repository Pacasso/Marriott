document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get('id');

    if (!idUsuario) {
        alert('No se identificó el usuario a editar.');
        window.location.href = 'PanelUsuarios.html';
        return;
    }

    // 1. Cargar Roles y luego los datos del Usuario
    fetch('/api/roles')
        .then(res => res.json())
        .then(datosRoles => {
            if (datosRoles.success) {
                const selectRol = document.getElementById('rol_usuario');
                selectRol.innerHTML = '<option value="">Seleccione un rol...</option>';
                datosRoles.roles.forEach(rol => {
                    selectRol.innerHTML += `<option value="${rol.id_rol}">${rol.nombre_rol}</option>`;
                });
            }
            return fetch(`/api/usuarios/${idUsuario}`);
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const u = datos.usuario;
                document.getElementById('id_usuario').value = u.id_usuario;
                document.getElementById('nombre_usuario').value = u.nombre_completo;
                document.getElementById('correo_usuario').value = u.correo_electronico;
                document.getElementById('rol_usuario').value = u.id_rol; 
                document.getElementById('estatus_usuario').value = u.estatus;
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelUsuarios.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // 2. Guardar los cambios (PUT)
    const btnActualizar = document.getElementById('btn_actualizar');
    
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre_completo = document.getElementById('nombre_usuario').value.trim();
            const correo_electronico = document.getElementById('correo_usuario').value.trim();
            const id_rol = document.getElementById('rol_usuario').value;
            const estatus = document.getElementById('estatus_usuario').value;

            if (!nombre_completo || !correo_electronico || !id_rol) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = { id_rol, nombre_completo, correo_electronico, estatus };

            fetch(`/api/usuarios/${idUsuario}`, {
                method: 'PUT',
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
            .catch(error => console.error('Error al actualizar:', error));
        });
    }
});
