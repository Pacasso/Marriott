document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idServicio = urlParams.get('id');

    if (!idServicio) {
        alert('No se identificó el servicio a editar.');
        window.location.href = 'PanelServicios.html';
        return;
    }

    fetch(`/api/servicios/${idServicio}`)
        .then(res => res.json())
        .then(datos => {
            if (datos.success) {
                const s = datos.servicio;
                document.getElementById('id_servicio').value = s.id_servicio;
                document.getElementById('nombre_servicio').value = s.nombre;
                document.getElementById('descripcion_servicio').value = s.descripcion;
                document.getElementById('costo_servicio').value = s.costo;
                document.getElementById('icono_servicio').value = s.icono;
                document.getElementById('estatus_servicio').value = s.estatus_activo;
            } else {
                alert(datos.mensaje);
                window.location.href = 'PanelServicios.html';
            }
        })
        .catch(err => console.error('Error al cargar:', err));

    const btnActualizar = document.getElementById('btn_actualizar');
    
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre_servicio').value.trim();
            const descripcion = document.getElementById('descripcion_servicio').value.trim();
            const costo = document.getElementById('costo_servicio').value;
            const icono = document.getElementById('icono_servicio').value;
            const estatus = document.getElementById('estatus_servicio').value;

            if (!nombre || !descripcion || !costo || !icono) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const datos = {
                nombre: nombre,
                descripcion: descripcion,
                costo: costo,
                icono: icono,
                estatus_activo: estatus
            };

            fetch(`/api/servicios/${idServicio}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
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
            .catch(error => console.error('Error al actualizar:', error));
        });
    }
});
