let habitacionesDisponibles = [];
let costoNumerico = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cargar catálogos (Hoteles, Usuarios y Habitaciones encadenados)
    cargarHoteles();
    cargarCatalogos();

    // 2. Evento para filtrar habitaciones por hotel o calcular el costo directamente
    document.getElementById('fecha_entrada').addEventListener('change', calcularCosto);
    document.getElementById('fecha_salida').addEventListener('change', calcularCosto);
    document.getElementById('id_habitacion').addEventListener('change', calcularCosto);

    // 3. Evento para guardar la reservación
    const btnGuardar = document.getElementById('btn_guardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            const id_usuario = document.getElementById('id_huesped').value;
            const id_habitacion = document.getElementById('id_habitacion').value;
            const fecha_entrada = document.getElementById('fecha_entrada').value;
            const fecha_salida = document.getElementById('fecha_salida').value;
            const estado_reserva = document.getElementById('estado_reserva').value;

            if (!id_usuario || !id_habitacion || !fecha_entrada || !fecha_salida || costoNumerico === 0) {
                alert('Por favor, complete todos los campos obligatorios y verifique las fechas.');
                return;
            }

            const datos = { id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total: costoNumerico, estado_reserva };

            fetch('/api/reservaciones', {
                method: 'POST',
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
            .catch(err => console.error('Error al guardar:', err));
        });
    }
});

// Función para listar los hoteles existentes en el select
function cargarHoteles() {
    fetch('/api/hoteles')
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const selectHotel = document.getElementById('id_hotel');
                if (selectHotel) {
                    selectHotel.innerHTML = '<option value="">-- Seleccione el Hotel --</option>';
                    datos.hoteles.forEach(hotel => {
                        selectHotel.innerHTML += `<option value="${hotel.id_hotel}">${hotel.nombre}</option>`;
                    });
                }
            }
        })
        .catch(err => console.error('Error al cargar hoteles:', err));
}

function cargarCatalogos() {
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
        })
        .catch(err => console.error('Error al cargar catálogos:', err));
}

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
