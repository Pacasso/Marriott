document.addEventListener('DOMContentLoaded', () => {
    cargarHabitaciones();

    const inputBusqueda = document.getElementById('input_busqueda');
    const btnBuscar = document.getElementById('btn_buscar');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            cargarHabitaciones(inputBusqueda.value.trim());
        });

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarHabitaciones(inputBusqueda.value.trim());
            }
        });
    }
});

function cargarHabitaciones(criterio = '') {
    const url = criterio 
        ? `http://localhost:3000/api/habitaciones?q=${encodeURIComponent(criterio)}` 
        : 'http://localhost:3000/api/habitaciones';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                // Seleccionamos el cuerpo de la tabla
                const tbody = document.querySelector('.tabla-container tbody');
                tbody.innerHTML = ''; 

                // Flujo alterno: sin coincidencias
                if (datos.habitaciones.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666; padding: 20px;">No se encontraron habitaciones registradas.</td></tr>';
                    return;
                }

                // Dibujar filas dinámicamente
                datos.habitaciones.forEach(hab => {
                    // Determinar el color del texto según el estado
                    let colorEstado = '#333';
                    if (hab.estatus === 'Disponible') colorEstado = '#155724';
                    else if (hab.estatus === 'En Mantenimiento') colorEstado = '#856404';
                    else if (hab.estatus === 'No Disponible') colorEstado = '#383d41';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${hab.numero}</td>
                        <td>${hab.categoria}</td>
                        <td>${hab.nombre_hotel}</td>
                        <td>${hab.capacidad} Huéspedes</td>
                        <td>$${hab.tarifa} MXN</td>
                        <td style="color: ${colorEstado}; font-weight: bold;">${hab.estatus}</td>
                        <td>
                            <a href="EditarHabitacion.html?id=${hab.id_habitacion}" class="btn-editar">✏ Editar</a>
                            <a href="EliminarHabitacion.html?id=${hab.id_habitacion}" class="btn-eliminar">🗑 Eliminar</a>
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