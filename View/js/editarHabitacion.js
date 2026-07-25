document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idHabitacion = urlParams.get('id');

    if (!idHabitacion) {
        alert('No se identificó la habitación a editar.');
        window.location.href = 'PanelHabitaciones.html';
        return;
    }

    // 1. Cargar Hoteles y luego los datos de la Habitación
    fetch('/api/hoteles')
        .then(res => res.json())
        .then(datosHoteles => {
            if (datosHoteles.success) {
                const selectHotel = document.getElementById('id_hotel');
                selectHotel.innerHTML = '<option value="">Seleccione un hotel...</option>';
                datosHoteles.hoteles.forEach(hotel => {
                    selectHotel.innerHTML += `<option value="${hotel.id_hotel}">${hotel.nombre}</option>`;
                });
            }
            // Retornamos la siguiente petición para encadenarla
            return fetch(`/api/habitaciones/${idHabitacion}`);
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const h = datos.habitacion;
                document.getElementById('id_habitacion').value = h.id_habitacion;
                document.getElementById('id_hotel').value = h.id_hotel; // Asigna el hotel actual
                document.getElementById('numero_habitacion').value = h.numero;
                document.getElementById('categoria_habitacion').value = h.categoria;
                document.getElementById('capacidad_habitacion').value = h.capacidad;
                document.getElementById('tarifa_habitacion').value = h.tarifa;
                document.getElementById('estatus_habitacion').value = h.estatus;
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelHabitaciones.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // 2. Guardar los cambios (PUT)
    const btnActualizar = document.getElementById('btn_actualizar');
    
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

            const id_hotel = document.getElementById('id_hotel').value;
            const numero = document.getElementById('numero_habitacion').value.trim();
            const categoria = document.getElementById('categoria_habitacion').value;
            const capacidad = document.getElementById('capacidad_habitacion').value;
            const tarifa = document.getElementById('tarifa_habitacion').value;
            const estatus = document.getElementById('estatus_habitacion').value;

            if (!id_hotel || !numero || !categoria || !capacidad || !tarifa) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = { id_hotel, numero, categoria, capacidad, tarifa, estatus };

            fetch(`/habitaciones/${idHabitacion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'PanelHabitaciones.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => console.error('Error al actualizar:', error));
        });
    }
});
