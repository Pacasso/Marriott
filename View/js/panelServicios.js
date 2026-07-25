document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();

    const inputBusqueda = document.querySelector('.barra input[type="text"]');
    const btnBuscar = document.querySelector('.barra button');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            cargarServicios(inputBusqueda.value.trim());
        });

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarServicios(inputBusqueda.value.trim());
            }
        });
    }
});

function cargarServicios(criterio = '') {
    const url = criterio 
        ? `/api/servicios?q=${encodeURIComponent(criterio)}` 
        : '/api/servicios';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                const contenedorCards = document.querySelector('.cards');
                contenedorCards.innerHTML = ''; 

                if (datos.servicios.length === 0 && criterio) {
                    alert(datos.mensaje);
                    return;
                }

                datos.servicios.forEach(servicio => {
                    const textoEstado = servicio.estatus_activo ? 'Disponible' : 'No Disponible';
                    const claseEstado = servicio.estatus_activo ? 'disponible' : 'no-disponible';

                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div class="icono">${servicio.icono}</div>
                        <h2>${servicio.nombre}</h2>
                        <p>${servicio.descripcion}</p>
                        <span>$${servicio.costo} MXN</span>
                        <div class="estado ${claseEstado}">${textoEstado}</div>
                        <div class="botones">
                            <a href="EditarServicio.html?id=${servicio.id_servicio}" class="editar">✏ Editar</a>
                            <a href="EliminarServicio.html?id=${servicio.id_servicio}" class="eliminar">🗑 Eliminar</a>
                        </div>
                    `;
                    contenedorCards.appendChild(card);
                });
            } else {
                alert('Error al cargar los servicios.');
            }
        })
        .catch(error => console.error('Error de conexión:', error));
}
