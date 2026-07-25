function eliminarDestino() {
    const urlParams = new URLSearchParams(window.location.search);
    const idDestino = urlParams.get('id');

    if (!idDestino) {
        alert("No se identificó el destino a eliminar.");
        window.location.href = "Destinos.html";
        return;
    }

    fetch(`/api/destinos/${idDestino}`, {
        method: 'DELETE'
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.success) {
            alert(datos.mensaje);
            window.location.href = "Destinos.html";
        } else {
            alert("Error: " + datos.mensaje);
        }
    })
    .catch(error => {
        console.error("Fallo de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    });
}
