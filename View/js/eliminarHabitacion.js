document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idHabitacion = urlParams.get('id');

    if (!idHabitacion) {
        alert('No se identificó la habitación a eliminar.');
        window.location.href = 'PanelHabitaciones.html';
        return;
    }

    // 1. Mostrar información en la alerta
    fetch(`http://localhost:3000/api/habitaciones/${idHabitacion}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const h = datos.habitacion;
                document.getElementById('id_habitacion').value = h.id_habitacion;
                document.getElementById('numero_habitacion').value = h.numero;
                document.getElementById('categoria_habitacion').value = h.categoria;
                // Aprovechamos el nombre del hotel traído mediante el JOIN en el DAO
                document.getElementById('hotel_habitacion').value = h.nombre_hotel; 
                document.getElementById('tarifa_habitacion').value = `$${h.tarifa} MXN`;
                document.getElementById('estatus_habitacion').value = h.estatus;
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelHabitaciones.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // 2. Ejecutar la eliminación (DELETE)
    const btnConfirmar = document.getElementById('btn_confirmar_eliminar');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            fetch(`http://localhost:3000/api/habitaciones/${idHabitacion}`, {
                method: 'DELETE'
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
            .catch(error => console.error('Error al eliminar:', error));
        });
    }
});