document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cargar lista de hoteles para el desplegable
    cargarHoteles();

    // 2. Evento para guardar la habitación
    const btnGuardar = document.getElementById('btn_guardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            const id_hotel = document.getElementById('id_hotel').value;
            const numero = document.getElementById('numero_habitacion').value.trim();
            const categoria = document.getElementById('categoria_habitacion').value;
            const capacidad = document.getElementById('capacidad_habitacion').value;
            const tarifa = document.getElementById('tarifa_habitacion').value;
            const estatus = document.getElementById('estatus_habitacion').value;

            // Validación local obligatoria
            if (!id_hotel || !numero || !categoria || !capacidad || !tarifa) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = { id_hotel, numero, categoria, capacidad, tarifa, estatus };

            fetch('/api/habitaciones', {
                method: 'POST',
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
            .catch(err => console.error('Error al guardar:', err));
        });
    }
});

function cargarHoteles() {
    fetch('/api/hoteles')
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const selectHotel = document.getElementById('id_hotel');
                selectHotel.innerHTML = '<option value="">Seleccione un hotel...</option>';
                
                datos.hoteles.forEach(hotel => {
                    selectHotel.innerHTML += `<option value="${hotel.id_hotel}">${hotel.nombre}</option>`;
                });
            }
        })
        .catch(err => console.error('Error al cargar hoteles:', err));
}
