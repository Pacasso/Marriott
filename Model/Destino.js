class Destino {
    constructor(nombre, id_estado, descripcion, atracciones, imagen, estatus_activo) {
        this.nombre = nombre;
        this.id_estado = id_estado;
        this.descripcion = descripcion;
        this.atracciones = atracciones;
        this.imagen = imagen;
        this.estatus_activo = estatus_activo;
    }

    getNombre() { return this.nombre; }
    getIdEstado() { return this.id_estado; }
    getDescripcion() { return this.descripcion; }
    getAtracciones() { return this.atracciones; }
    getImagen() { return this.imagen; }
    getEstatusActivo() { return this.estatus_activo; }
    getIdDestino() { return this.id_destino; }
    getNombreEstado() { return this.nombre_estado; }

    setNombre(nombre) { this.nombre = nombre; }
    setIdEstado(id_estado) { this.id_estado = id_estado; }
    setDescripcion(descripcion) { this.descripcion = descripcion; }
    setAtracciones(atracciones) { this.atracciones = atracciones; }
    setImagen(imagen) { this.imagen = imagen; }
    setEstatusActivo(estatus_activo) { this.estatus_activo = estatus_activo; }
    setIdDestino(id_destino) { this.id_destino = id_destino; }
    setNombreEstado(nombre_estado) { this.nombre_estado = nombre_estado; }
}

module.exports = Destino;