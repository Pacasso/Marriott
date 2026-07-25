document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtenemos el ID del hotel desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idHotel = urlParams.get('id');
    
    // Variable global para recordar la imagen de la base de datos
    let imagenActual = '';

    if (!idHotel) {
        alert('No se identificó el hotel a editar.');
        window.location.href = 'PanelHoteles.html';
        return;
    }

    // ==========================================
    // 2. CARGAR SERVICIOS Y DESTINOS PRIMERO
    // ==========================================
    fetch('/api/servicios')
        .then(res => res.json())
        .then(datosServicios => {
            if (datosServicios.success) {
                const contenedor = document.getElementById('contenedor_servicios');
                contenedor.innerHTML = ''; 
                
                // Dibujamos las casillas del catálogo maestro
                datosServicios.servicios.forEach(servicio => {
                    contenedor.innerHTML += `
                        <label style="display: flex; align-items: center; gap: 5px; font-size: 14px; color: #495057;">
                            <input type="checkbox" name="servicios" value="${servicio.nombre}">
                            ${servicio.icono} ${servicio.nombre}
                        </label>
                    `;
                });
            }
            
            // Una vez dibujados los servicios, cargamos los destinos
            return fetch('/api/destinos');
        })
        .then(res => res.json())
        .then(datosDestinos => {
            if (datosDestinos.success) {
                const selectDestino = document.getElementById('estado_hotel');
                datosDestinos.destinos.forEach(destino => {
                    const option = document.createElement('option');
                    option.value = destino.id_destino;
                    option.textContent = `${destino.nombre}, ${destino.nombre_estado}`;
                    selectDestino.appendChild(option);
                });
                
                // Una vez que los combos y checkboxes existen en el HTML, pedimos los datos del hotel
                cargarDatosHotel();
            }
        })
        .catch(error => console.error('Error en la carga inicial:', error));

    // ==========================================
    // 3. CARGAR DATOS DEL HOTEL A EDITAR
    // ==========================================
    function cargarDatosHotel() {
        fetch(`/api/hoteles/${idHotel}`)
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    const hotel = datos.hotel;
                    
                    document.getElementById('id_hotel').value = hotel.id_hotel;
                    document.getElementById('nombre_hotel').value = hotel.nombre;
                    document.getElementById('estado_hotel').value = hotel.id_destino; 
                    document.getElementById('habitaciones_hotel').value = hotel.habitaciones;
                    document.getElementById('categoria_hotel').value = hotel.categoria;
                    document.getElementById('tarifa_hotel').value = hotel.tarifa;
                    document.getElementById('estatus_hotel').value = hotel.estatus_activo;
                    document.getElementById('promociones_hotel').value = hotel.promociones;

                    // AHORA SÍ: Marcar dinámicamente los checkboxes que ya existen en el HTML
                    if (hotel.servicios) {
                        const serviciosArray = hotel.servicios.split(','); 
                        serviciosArray.forEach(servicio => {
                            // Buscamos la casilla por su valor exacto y la activamos
                            const checkbox = document.querySelector(`input[name="servicios"][value="${servicio.trim()}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }

                    imagenActual = hotel.imagen;
                    const preview = document.getElementById('preview_imagen');
                    if (imagenActual) {
                        preview.src = `img/${imagenActual}`;
                        preview.style.display = 'block';
                    }
                } else {
                    alert('Error: ' + datos.mensaje);
                    window.location.href = 'PanelHoteles.html';
                }
            })
            .catch(error => console.error('Error al cargar el hotel:', error));
    }

    // ==========================================
    // 4. CARGAR DATOS DEL HOTEL A EDITAR
    // ==========================================
    function cargarDatosHotel() {
        fetch(`/api/hoteles/${idHotel}`)
            .then(res => res.json())
            .then(datos => {
                if (datos.success) {
                    const hotel = datos.hotel;
                    
                    // Llenar campos de texto y numéricos
                    document.getElementById('id_hotel').value = hotel.id_hotel;
                    document.getElementById('nombre_hotel').value = hotel.nombre;
                    document.getElementById('estado_hotel').value = hotel.id_destino; // Selecciona el destino correcto
                    document.getElementById('habitaciones_hotel').value = hotel.habitaciones;
                    document.getElementById('categoria_hotel').value = hotel.categoria;
                    document.getElementById('tarifa_hotel').value = hotel.tarifa;
                    document.getElementById('estatus_hotel').value = hotel.estatus_activo;
                    document.getElementById('promociones_hotel').value = hotel.promociones;

                    // Marcar dinámicamente los checkboxes de servicios
                    if (hotel.servicios) {
                        const serviciosArray = hotel.servicios.split(','); // Convertimos el string a arreglo
                        serviciosArray.forEach(servicio => {
                            // Buscamos el checkbox que tenga el mismo "value" y lo marcamos
                            const checkbox = document.querySelector(`input[name="servicios"][value="${servicio.trim()}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }

                    // Manejo de la imagen actual
                    imagenActual = hotel.imagen;
                    const preview = document.getElementById('preview_imagen');
                    if (imagenActual) {
                        preview.src = `img/${imagenActual}`;
                        preview.style.display = 'block';
                    }
                } else {
                    alert('Error: ' + datos.mensaje);
                    window.location.href = 'PanelHoteles.html';
                }
            })
            .catch(error => console.error('Error al cargar el hotel:', error));
    }

    // ==========================================
    // 5. PREVISUALIZACIÓN DE NUEVA IMAGEN
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
                // Si cancela la selección, regresamos a la imagen de la BD
                if (imagenActual) {
                    preview.src = `img/${imagenActual}`;
                    preview.style.display = 'block';
                } else {
                    preview.style.display = 'none';
                }
            }
        });
    }

    // ==========================================
    // 6. GUARDAR LOS CAMBIOS (PUT)
    // ==========================================
    const btnActualizar = document.getElementById('btn_actualizar');
    
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre_hotel').value.trim();
            const id_destino = document.getElementById('estado_hotel').value;
            const habitaciones = document.getElementById('habitaciones_hotel').value;
            const categoria = document.getElementById('categoria_hotel').value;
            const tarifa = document.getElementById('tarifa_hotel').value;
            const estatus = document.getElementById('estatus_hotel').value;
            const promociones = document.getElementById('promociones_hotel').value.trim();

            const checkboxesServicios = document.querySelectorAll('input[name="servicios"]:checked');
            const serviciosSeleccionados = Array.from(checkboxesServicios).map(cb => cb.value).join(',');

            if (!nombre || !id_destino || !habitaciones || !categoria || !tarifa) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('id_destino', id_destino);
            formData.append('habitaciones', habitaciones);
            formData.append('categoria', categoria);
            formData.append('tarifa', tarifa);
            formData.append('estatus_activo', estatus);
            formData.append('promociones', promociones);
            formData.append('servicios', serviciosSeleccionados);
            formData.append('imagenActual', imagenActual); 
            
            if (imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]); 
            }

            fetch(`/api/hoteles/${idHotel}`, {
                method: 'PUT',
                body: formData
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'PanelHoteles.html';
                } else {
                    alert('Error: ' + datos.mensaje);
                }
            })
            .catch(error => {
                console.error('Error al actualizar:', error);
                alert('No se pudieron guardar los cambios.');
            });
        });
    }
});
