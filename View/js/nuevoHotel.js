document.addEventListener('DOMContentLoaded', () => {
    
    cargarDestinos();
    cargarServiciosCatalogo();

    // ==========================================
    // 1. LLENAR EL COMBO BOX DE UBICACIONES
    // ==========================================
    function cargarDestinos() {
        fetch('/api/destinos')
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    const selectDestino = document.getElementById('estado_hotel');
                    
                    datos.destinos.forEach(destino => {
                        const option = document.createElement('option');
                        option.value = destino.id_destino; 
                        // Mostramos el Destino y su Estado (Ej. "Cancún, Quintana Roo")
                        option.textContent = `${destino.nombre}, ${destino.nombre_estado}`;
                        selectDestino.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error al cargar destinos:', error));
    }

    // ==========================================
    // NUEVO: LLENAR LOS CHECKBOXES DE SERVICIOS
    // ==========================================
    function cargarServiciosCatalogo() {
        fetch('/api/servicios')
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    const contenedor = document.getElementById('contenedor_servicios');
                    contenedor.innerHTML = ''; 
                    
                    datos.servicios.forEach(servicio => {
                       
                        if (servicio.estatus_activo) {
                            contenedor.innerHTML += `
                                <label style="display: flex; align-items: center; gap: 5px; font-size: 14px; color: #495057;">
                                    <input type="checkbox" name="servicios" value="${servicio.nombre}">
                                    ${servicio.icono} ${servicio.nombre}
                                </label>
                            `;
                        }
                    });
                }
            })
            .catch(error => console.error('Error al cargar servicios:', error));
    }

    // ==========================================
    // 2. PREVISUALIZACIÓN DE LA IMAGEN
    // ==========================================
    const imagenInput = document.getElementById('imagen_hotel');
    const preview = document.getElementById('preview_imagen');

    if (imagenInput) {
        imagenInput.addEventListener('change', function(e) {
            const archivoSeleccionado = e.target.files[0];
            
            if (archivoSeleccionado) {
                const reader = new FileReader();
                reader.onload = function(evento) {
                    preview.src = evento.target.result;
                    preview.style.display = 'block'; 
                }
                reader.readAsDataURL(archivoSeleccionado);
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 3. GUARDAR EL HOTEL
    // ==========================================
    const btnGuardar = document.getElementById('btn_guardar');

    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            // Capturamos los campos de texto y numéricos
            const nombre = document.getElementById('nombre_hotel').value.trim();
            const id_destino = document.getElementById('estado_hotel').value;
            const habitaciones = document.getElementById('habitaciones_hotel').value;
            const categoria = document.getElementById('categoria_hotel').value;
            const tarifa = document.getElementById('tarifa_hotel').value;
            const estatus = document.getElementById('estatus_hotel').value;
            const promociones = document.getElementById('promociones_hotel').value.trim();

            // Capturamos todos los checkboxes que el usuario haya marcado
            const checkboxesServicios = document.querySelectorAll('input[name="servicios"]:checked');
            // Extraemos solo el atributo "value" y los unimos con comas (Ej. "Restaurante,Piscina")
            const serviciosSeleccionados = Array.from(checkboxesServicios).map(cb => cb.value).join(',');

            // Validaciones frontend obligatorias
            if (!nombre || !id_destino || !habitaciones || !categoria || !tarifa) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            if (imagenInput.files.length === 0) {
                alert('Es obligatorio subir una fotografía del hotel.');
                return;
            }

            // Empaquetamos todo para enviarlo al Controller
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('id_destino', id_destino);
            formData.append('habitaciones', habitaciones);
            formData.append('categoria', categoria);
            formData.append('tarifa', tarifa);
            formData.append('estatus_activo', estatus);
            formData.append('promociones', promociones);
            formData.append('servicios', serviciosSeleccionados);
            formData.append('imagen', imagenInput.files[0]);

            // Petición al backend
            fetch('/api/hoteles', {
                method: 'POST',
                body: formData 
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    // Redirigimos al panel principal si todo salió bien
                    window.location.href = 'PanelHoteles.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => {
                console.error('Error de red:', error);
                alert('No se pudo conectar con el servidor.');
            });
        });
    }
});
