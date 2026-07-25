document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idServicio = urlParams.get('id');

    if (!idServicio) {
        alert('No se identificó el servicio a eliminar.');
        window.location.href = 'PanelServicios.html';
        return;
    }

    fetch(`http://localhost:3000/api/servicios/${idServicio}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const s = datos.servicio;
                document.getElementById('id_servicio').value = s.id_servicio;
                document.getElementById('nombre_servicio').value = s.nombre;
                document.getElementById('costo_servicio').value = `$${s.costo} MXN`;
                document.getElementById('estatus_servicio').value = s.estatus_activo ? 'Disponible' : 'No Disponible';
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelServicios.html';
            }
        })
        .catch(err => console.error('Error al cargar datos:', err));

    const btnConfirmar = document.getElementById('btn_confirmar_eliminar');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            fetch(`http://localhost:3000/api/servicios/${idServicio}`, {
                method: 'DELETE'
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'PanelServicios.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => {
                console.error('Error al eliminar:', error);
                alert('Ocurrió un error al intentar eliminar el registro.');
            });
        });
    }
});