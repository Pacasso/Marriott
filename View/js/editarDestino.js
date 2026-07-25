document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idDestino = urlParams.get('id');

    // Variable global para recordar la imagen que viene de la BD
    let imagenActual = '';

    if (!idDestino) {
        alert('No se identificó el destino a editar.');
        window.location.href = 'Destinos.html';
        return;
    }

    // ==========================================
    // FASE 1: CARGAR ESTADOS PRIMERO
    // ==========================================
    fetch('/api/estados')
        .then(res => res.json())
        .then(datosEstados => {
            if (datosEstados.success) {
                const selectEstado = document.getElementById('estado_destino');
                datosEstados.estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.id_estado;
                    option.textContent = estado.nombre;
                    selectEstado.appendChild(option);
                });

                // Una vez que el combo box está lleno, cargamos los datos del destino
                cargarDatosDestino();
            }
        })
        .catch(error => console.error('Error al cargar estados:', error));


    // ==========================================
    // FASE 2: CARGAR DATOS DEL DESTINO A EDITAR
    // ==========================================
    function cargarDatosDestino() {
        fetch(`/api/destinos/${idDestino}`)
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    const idInput = document.getElementById('id_destino');
                    if(idInput) idInput.value = datos.destino.id_destino;
                    
                    document.getElementById('nombre_destino').value = datos.destino.nombre;
                    
                    
                    document.getElementById('estado_destino').value = datos.destino.id_estado;
                    
                    document.getElementById('descripcion_destino').value = datos.destino.descripcion;
                    document.getElementById('atracciones_destino').value = datos.destino.atracciones;
                    
                    // Asignamos el estatus
                    const estatusInput = document.getElementById('estatus_destino');
                    if(estatusInput) estatusInput.value = datos.destino.estatus_activo ? "1" : "0";
                    
                    imagenActual = datos.destino.imagen;
                    
                    // Mostrar la imagen actual en la vista previa
                    const preview = document.getElementById('preview_imagen');
                    if (imagenActual) {
                        preview.src = `img/${imagenActual}`;
                        preview.style.display = 'block';
    
                        preview.onerror = function() {
                            preview.style.display = 'none';
                        };
                    }
                } else {
                    alert('Error: ' + datos.mensaje);
                    window.location.href = 'Destinos.html';
                }
            })
            .catch(error => {
                console.error('Error al cargar destino:', error);
                alert('No se pudo conectar con el servidor.');
            });
    }

    // ==========================================
    // FASE 3: PREVISUALIZACIÓN EN TIEMPO REAL
    // ==========================================
    const imagenInput = document.getElementById('imagen_destino');
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
    // FASE 4: GUARDAR LOS NUEVOS CAMBIOS
    // ==========================================
    const btnActualizar = document.getElementById('btn_actualizar');
    
    if (btnActualizar) {
        btnActualizar.addEventListener('click', (e) => {
            e.preventDefault();

           
            const nombreInput = document.getElementById('nombre_destino').value;
            const estadoInput = document.getElementById('estado_destino').value; 
            const descripcionInput = document.getElementById('descripcion_destino').value;
            const atraccionesInput = document.getElementById('atracciones_destino').value;
            
            const estatusElement = document.getElementById('estatus_destino');
            const estatusInput = estatusElement ? estatusElement.value : "1";

            const formData = new FormData();
            formData.append('nombre', nombreInput);
            formData.append('id_estado', estadoInput);
            formData.append('descripcion', descripcionInput);
            formData.append('atracciones', atraccionesInput);
            formData.append('estatus_activo', estatusInput);
            formData.append('imagenActual', imagenActual); 
            
            if (imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]); 
            }

            fetch(`/api/destinos/${idDestino}`, {
                method: 'PUT',
                body: formData
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    alert(datos.mensaje);
                    window.location.href = 'Destinos.html';
                } else {
                    alert(datos.mensaje);
                }
            })
            .catch(error => {
                console.error('Error al actualizar:', error);
                alert('No se pudieron guardar los cambios.');
            });
        });
    }
});
