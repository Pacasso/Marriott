document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.getElementById('btn_guardar');

    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
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

            fetch('/api/servicios', {
                method: 'POST',
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
            .catch(error => {
                console.error('Error al guardar:', error);
                alert('No se pudo conectar con el servidor.');
            });
        });
    }
});
