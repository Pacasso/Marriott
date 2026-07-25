document.addEventListener('DOMContentLoaded', () => {
    cargarReservaciones();

    const inputBusqueda = document.getElementById('input_busqueda');
    const btnBuscar = document.getElementById('btn_buscar');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            cargarReservaciones(inputBusqueda.value.trim());
        });

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarReservaciones(inputBusqueda.value.trim());
            }
        });
    }
});

function cargarReservaciones(criterio = '') {
    const url = criterio 
        ? `http://localhost:3000/api/reservaciones?q=${encodeURIComponent(criterio)}` 
        : 'http://localhost:3000/api/reservaciones';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                // Seleccionamos el cuerpo de la tabla
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = ''; 

                // Flujo alterno: sin coincidencias
                if (datos.reservaciones.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666; padding: 20px;">No se encontraron reservaciones registradas.</td></tr>';
                    return;
                }

                // Dibujar filas dinámicamente
                datos.reservaciones.forEach(res => {
                    const fechaIn = new Date(res.fecha_entrada).toLocaleDateString('es-MX');
                    const fechaOut = new Date(res.fecha_salida).toLocaleDateString('es-MX');
                    const costoFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(res.costo_total);

                    let badgeClass = 'badge-pendiente';
                    if(res.estado_reserva === 'Confirmada') badgeClass = 'badge-confirmada';
                    if(res.estado_reserva === 'Cancelada') badgeClass = 'badge-cancelada';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>#RES-${res.id_reservacion.toString().padStart(3, '0')}</strong></td>
                        <td>${res.nombre_huesped}</td>
                        <td>${res.nombre_hotel}<br><small>${res.numero_habitacion}</small></td>
                        <td>${fechaIn}<br><small>al${fechaOut}</small></td>
                        <td>${costoFmt}</td>
                        <td><span class="badge ${badgeClass}">${res.estado_reserva}</span></td>
                        <td>
                            <a href="EditarReservacion.html?id=${res.id_reservacion}" class="btn-editar">✏ Editar</a>
                            <a href="EliminarReservacion.html?id=${res.id_reservacion}" class="btn-eliminar">🗑 Eliminar</a>
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