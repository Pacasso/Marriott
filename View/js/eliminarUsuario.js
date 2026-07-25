document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get('id');

    if (!idUsuario) {
        alert('No se identificó el usuario a eliminar.');
        window.location.href = 'PanelUsuarios.html';
        return;
    }

    // 1. Mostrar información en la alerta
    fetch(`/api/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const u = datos.usuario;
                document.getElementById('id_usuario').value = u.id_usuario;
                document.getElementById('nombre_usuario').value = u.nombre_completo;
                document.getElementById('correo_usuario').value = u.correo_electronico;
                document.getElementById('rol_usuario').value = u.nombre_rol; 
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelUsuarios.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // 2. Ejecutar la eliminación (DELETE)
    const btnConfirmar = document.getElementById('btn_confirmar_eliminar');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            fetch(`/api/usuarios/${idUsuario}`, {
                method: 'DELETE'
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
            .catch(error => console.error('Error al eliminar:', error));
        });
    }
});
