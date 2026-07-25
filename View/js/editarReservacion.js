let habitacionesDisponibles = [];
let costoNumerico = 0;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idReservacion = urlParams.get('id');

    if (!idReservacion) {
        alert('No se identificó la reservación a editar.');
        window.location.href = 'PanelReservaciones.html';
        return;
    }

    // 1. Cargar Usuarios, luego Habitaciones, luego los datos de la Reservación
    fetch('/api/usuarios')
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const selectHuesped = document.getElementById('id_huesped');
                selectHuesped.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
                const huespedes = datos.usuarios.filter(u => u.id_rol === 4);
                huespedes.forEach(h => {
                    selectHuesped.innerHTML += `<option value="${h.id_usuario}">${h.nombre_completo}</option>`;
                });
            }
            return fetch('/api/habitaciones');
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                habitacionesDisponibles = datos.habitaciones;
                const selectHabitacion = document.getElementById('id_habitacion');
                selectHabitacion.innerHTML = '<option value="">-- Seleccione una habitación --</option>';
                habitacionesDisponibles.forEach(hab => {
                    selectHabitacion.innerHTML += `<option value="${hab.id_habitacion}">${hab.nombre_hotel} - ${hab.numero} (${hab.categoria})</option>`;
                });
            }
            return fetch(`/api/reservaciones/${idReservacion}`);
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const r = datos.reservacion;
                
                // Formateamos las fechas para los inputs
                const fEntrada = new Date(r.fecha_entrada).toISOString().split('T')[0];
                const fSalida = new Date(r.fecha_salida).toISOString().split('T')[0];

                document.getElementById('id_reservacion').value = r.id_reservacion;
                document.getElementById('id_huesped').value = r.id_usuario;
                document.getElementById('id_habitacion').value = r.id_habitacion;
                document.getElementById('fecha_entrada').value = fEntrada;
                document.getElementById('fecha_salida').value = fSalida;
                document.getElementById('estado_reserva').value = r.estado_reserva;
                
                costoNumerico = r.costo_total;
                document.getElementById('costo_total').value = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(costoNumerico);
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelReservaciones.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // Listeners para recalcular el costo en vivo
    document.getElementById('fecha_entrada').addEventListener('change', calcularCosto);
    document.getElementById('fecha_salida').addEventListener('change', calcularCosto);
    document.getElementById('id_habitacion').addEventListener('change', calcularCosto);

    // 2. Guardar los cambios (PUT)
    const btnActualizar = document.getElementById('btn_actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

            const id_usuario = document.getElementById('id_huesped').value;
            const id_habitacion = document.getElementById('id_habitacion').value;
            const fecha_entrada = document.getElementById('fecha_entrada').value;
            const fecha_salida = document.getElementById('fecha_salida').value;
            const estado_reserva = document.getElementById('estado_reserva').value;

            if (!id_usuario || !id_habitacion || !fecha_entrada || !fecha_salida || costoNumerico === 0) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = { id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total: costoNumerico, estado_reserva };

            fetch(`/api/reservaciones/${idReservacion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'PanelReservaciones.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => console.error('Error al actualizar:', error));
        });
    }
});

function calcularCosto() {
    const inputFechaEntrada = document.getElementById('fecha_entrada');
    const inputFechaSalida = document.getElementById('fecha_salida');
    const selectHabitacion = document.getElementById('id_habitacion');
    const inputCostoTotal = document.getElementById('costo_total');

    if (!inputFechaEntrada.value || !inputFechaSalida.value || !selectHabitacion.value) {
        inputCostoTotal.value = '$0.00';
        costoNumerico = 0;
        return;
    }

    const fechaEntrada = new Date(inputFechaEntrada.value);
    const fechaSalida = new Date(inputFechaSalida.value);
    const idHabitacion = parseInt(selectHabitacion.value);

    if (fechaSalida <= fechaEntrada) {
        alert('Error: La fecha de salida debe ser posterior a la fecha de entrada.');
        inputFechaSalida.value = ''; 
        inputCostoTotal.value = '$0.00';
        costoNumerico = 0;
        return;
    }

    const diferenciaMilisegundos = fechaSalida.getTime() - fechaEntrada.getTime();
    const diasEstadia = Math.ceil(diferenciaMilisegundos / (1000 * 3600 * 24));

    const habitacionSeleccionada = habitacionesDisponibles.find(h => h.id_habitacion === idHabitacion);
    
    if (habitacionSeleccionada) {
        costoNumerico = diasEstadia * habitacionSeleccionada.tarifa;
        inputCostoTotal.value = new Intl.NumberFormat('es-MX', {
            style: 'currency', currency: 'MXN'
        }).format(costoNumerico);
    }
}
