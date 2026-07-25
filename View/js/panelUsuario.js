document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();

    const inputBusqueda = document.getElementById('input_busqueda');
    const btnBuscar = document.getElementById('btn_buscar');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            cargarUsuarios(inputBusqueda.value.trim());
        });

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarUsuarios(inputBusqueda.value.trim());
            }
        });
    }
});

function cargarUsuarios(criterio = '') {
    const url = criterio 
        ? `/api/usuarios?q=${encodeURIComponent(criterio)}` 
        : '/api/usuarios';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                const tbody = document.querySelector('.tabla-container tbody');
                tbody.innerHTML = ''; 

                if (datos.usuarios.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; padding: 20px;">No se encontraron usuarios registrados.</td></tr>';
                    return;
                }

                datos.usuarios.forEach(user => {
                    let colorEstado = user.estatus === 'Activo' ? '#155724' : '#383d41';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.nombre_completo}</td>
                        <td>${user.correo_electronico}</td>
                        <td>${user.nombre_rol}</td>
                        <td style="color: ${colorEstado}; font-weight: bold;">${user.estatus}</td>
                        <td>
                            <a href="EditarUsuario.html?id=${user.id_usuario}" class="btn-editar">✏ Editar</a>
                            <a href="EliminarUsuario.html?id=${user.id_usuario}" class="btn-eliminar">🗑 Eliminar</a>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                alert('Error del servidor: ' + datos.mensaje);
            }
        })
        .catch(error => console.error('Error de conexión:', error));
}
