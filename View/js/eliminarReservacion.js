document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idReservacion = urlParams.get('id');

    if (!idReservacion) {
        alert('No se identificó la reservación a eliminar.');
        window.location.href = 'PanelReservaciones.html';
        return;
    }

    // 1. Mostrar información en la alerta
    fetch(`http://localhost:3000/api/reservaciones/${idReservacion}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const r = datos.reservacion;
                const fechaIn = new Date(r.fecha_entrada).toLocaleDateString('es-MX');
                const fechaOut = new Date(r.fecha_salida).toLocaleDateString('es-MX');
                const costoFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(r.costo_total);

                const inputsRes = document.querySelectorAll('.info-reservacion input');
                
                // Aprovechamos los datos traídos mediante el JOIN en el DAO
                if (inputsRes.length >= 6) {
                    inputsRes[0].value = `#RES-${r.id_reservacion.toString().padStart(3, '0')}`;
                    inputsRes[1].value = r.nombre_huesped;
                    inputsRes[2].value = r.nombre_hotel;
                    inputsRes[3].value = r.numero_habitacion;
                    inputsRes[4].value = `${fechaIn} al ${fechaOut}`;
                    inputsRes[5].value = costoFmt;
                }
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelReservaciones.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    // 2. Ejecutar la eliminación (DELETE)
    const btnConfirmar = document.getElementById('btn_confirmar_eliminar');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            fetch(`http://localhost:3000/api/reservaciones/${idReservacion}`, {
                method: 'DELETE'
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
            .catch(error => console.error('Error al eliminar:', error));
        });
    }
});