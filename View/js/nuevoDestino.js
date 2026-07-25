document.addEventListener('DOMContentLoaded', () => {
    cargarEstados();

    function cargarEstados() {
        fetch('http://localhost:3000/api/estados')
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    const selectEstado = document.getElementById('estado_destino');
                    datos.estados.forEach(estado => {
                        const option = document.createElement('option');
                        option.value = estado.id_estado;
                        option.textContent = estado.nombre;
                        selectEstado.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error al cargar estados:', error));
    }

    // ==========================================
    // 1. LÓGICA DE PREVISUALIZACIÓN DE IMAGEN
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
                    preview.style.display = 'block'; // Mostramos la miniatura
                }
                reader.readAsDataURL(archivoSeleccionado);
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 2. LÓGICA PARA GUARDAR EL NUEVO DESTINO
    // ==========================================
    const btnGuardar = document.getElementById('btn_guardar');

    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();

            // Captura de textos
            const nombreInput = document.getElementById('nombre_destino').value;
            const estadoInput = document.getElementById('estado_destino').value;
            const descripcionInput = document.getElementById('descripcion_destino').value;
            const atraccionesInput = document.getElementById('atracciones_destino').value;
            const estatusInput = document.getElementById('estatus_destino').value;

        
            const formData = new FormData();
            formData.append('nombre', nombreInput);
            formData.append('id_estado', estadoInput);
            formData.append('descripcion', descripcionInput);
            formData.append('atracciones', atraccionesInput);
            formData.append('estatus_activo', estatusInput);

            // Verificamos si hay una imagen para enviarla
            if (imagenInput.files.length > 0) {
                formData.append('imagen', imagenInput.files[0]); // Archivo físico
            }

            // Petición al backend
            fetch('http://localhost:3000/api/destinos', {
                method: 'POST',
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
                console.error('Error de red:', error);
                alert('No se pudo conectar con el servidor.');
            });
        });
    }
});