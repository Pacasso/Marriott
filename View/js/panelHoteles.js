document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar todos los hoteles al abrir la página
    cargarHoteles();

    // 2. Configurar el botón de búsqueda
    const btnBuscar = document.getElementById('btn_buscar');
    const inputBusqueda = document.getElementById('input_busqueda');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            cargarHoteles(inputBusqueda.value.trim());
        });

        // Permitir búsqueda al presionar la tecla Enter
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarHoteles(inputBusqueda.value.trim());
            }
        });
    }
});

function cargarHoteles(criterio = '') {
    // Si hay un criterio de búsqueda, armamos la URL con el parámetro 'q'
    const url = criterio 
        ? `http://localhost:3000/api/hoteles?q=${encodeURIComponent(criterio)}` 
        : 'http://localhost:3000/api/hoteles';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                const tbody = document.querySelector('.tabla-container tbody');
                tbody.innerHTML = ''; // Limpiamos los registros estáticos previos

                // Si no hay resultados tras una búsqueda
                if (datos.hoteles.length === 0 && criterio) {
                    alert(datos.mensaje);
                    return;
                }

                // Iteramos sobre los datos reales de MySQL
                datos.hoteles.forEach(hotel => {
                    const estadoTexto = hotel.estatus_activo ? 'Activo' : 'Inactivo';
                    
                    const fila = document.createElement('tr');
                    
                    fila.innerHTML = `
                        <td>${hotel.id_hotel}</td>
                        <td>${hotel.nombre}</td>
                        <td>${hotel.ubicacion_completa}</td> <!-- Dato cruzado (Destino + Estado) -->
                        <td>${hotel.categoria}</td>
                        <td>${hotel.habitaciones}</td>
                        <td>${estadoTexto}</td>
                        <td>
                            <a href="EditarHotel.html?id=${hotel.id_hotel}" class="btn-editar">✏ Editar</a>
                            <a href="EliminarHotel.html?id=${hotel.id_hotel}" class="btn-eliminar">🗑 Eliminar</a>
                        </td>
                    `;
                    
                    tbody.appendChild(fila);
                });
            } else {
                console.error('Error del servidor:', datos.mensaje);
                alert('Hubo un error al cargar los hoteles.');
            }
        })
        .catch(error => {
            console.error('Fallo en la comunicación:', error);
            alert('No se pudo conectar con el servidor.');
        });
}