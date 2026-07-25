document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtenemos el ID del hotel desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idHotel = urlParams.get('id');

    if (!idHotel) {
        alert('No se identificó el hotel a eliminar.');
        window.location.href = 'PanelHoteles.html';
        return;
    }

    // ==========================================
    // 2. CARGAR LOS DATOS PARA LA ADVERTENCIA
    // ==========================================
    fetch(`http://localhost:3000/api/hoteles/${idHotel}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const hotel = datos.hotel;
                
                // Llenamos los campos de solo lectura para que el usuario confirme
                document.getElementById('id_hotel').value = hotel.id_hotel;
                document.getElementById('nombre_hotel').value = hotel.nombre;
                
                // Usamos la variable cruzada que viene del DAO
                document.getElementById('ubicacion_hotel').value = hotel.ubicacion_completa;
                
                // Formateamos el estatus visualmente
                document.getElementById('estatus_hotel').value = hotel.estatus_activo ? 'Activo / Operando' : 'Inactivo';
            } else {
                alert('Error: ' + datos.mensaje);
                window.location.href = 'PanelHoteles.html';
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del hotel:', error);
            alert('No se pudo conectar con el servidor para leer los datos del hotel.');
        });

    // ==========================================
    // 3. EJECUTAR LA ELIMINACIÓN (DELETE)
    // ==========================================
    const btnConfirmarEliminar = document.getElementById('btn_confirmar_eliminar');
    
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', () => {
            
            // Enviamos la petición DELETE al backend
            fetch(`http://localhost:3000/api/hoteles/${idHotel}`, {
                method: 'DELETE'
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    // Si se elimina correctamente, regresamos a la tabla
                    window.location.href = 'PanelHoteles.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => {
                console.error('Error al intentar eliminar:', error);
                alert('Ocurrió un error al intentar eliminar el registro.');
            });
            
        });
    }
});