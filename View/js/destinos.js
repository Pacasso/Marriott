// ==========================================
// INTERFAZ DE USUARIO (UI)
// ==========================================
function toggleMenu(){
    document.getElementById("sidebar").classList.toggle("ocultar");
    document.getElementById("main").classList.toggle("expandir");
}

// ==========================================
// LÓGICA DE NEGOCIO (FETCH AL BACKEND)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarDestinos();

    const btnBuscar = document.getElementById('btn_buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const criterio = document.getElementById('input_busqueda').value;
            cargarDestinos(criterio);
        });
    }
});

function cargarDestinos(criterio = '') {
    const url = criterio ? `http://localhost:3000/api/destinos?q=${encodeURIComponent(criterio)}` : 'http://localhost:3000/api/destinos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                const tbody = document.querySelector('.tabla-container tbody');
                tbody.innerHTML = ''; 

                if (datos.destinos.length === 0 && criterio) {
                    alert(datos.mensaje);
                    return;
                }

                datos.destinos.forEach(destino => {
                    const estadoTexto = destino.estatus_activo ? 'Activo' : 'Inactivo';
                    const fila = document.createElement('tr');
                    
                    fila.innerHTML = `
                        <td>${destino.id_destino}</td>
                        <td>${destino.nombre}</td>
                        <td>${destino.nombre_estado}</td> <td>${destino.descripcion}</td>
                        <td>${destino.atracciones}</td>
                        <td>${estadoTexto}</td>
                        <td>
                            <a href="EditarDestino.html?id=${destino.id_destino}" class="btn-editar">✏ Editar</a>
                            <a href="EliminarDestino.html?id=${destino.id_destino}" class="btn-eliminar">🗑 Eliminar</a>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                console.error('Error del servidor:', datos.mensaje);
            }
        })
        .catch(error => console.error('Fallo en la comunicación:', error));
}