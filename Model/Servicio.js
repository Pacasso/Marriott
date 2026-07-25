class Servicio {
    constructor(id_servicio, nombre, descripcion, costo, icono, estatus_activo) {
        this.id_servicio = id_servicio;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costo = costo;
        this.icono = icono;
        this.estatus_activo = estatus_activo;
    }

    getIdServicio() { return this.id_servicio; }
    getNombre() { return this.nombre; }
    getDescripcion() { return this.descripcion; }
    getCosto() { return this.costo; }
    getIcono() { return this.icono; }
    getEstatusActivo() { return this.estatus_activo; }

    setIdServicio(id_servicio) { this.id_servicio = id_servicio; }
    setNombre(nombre) { this.nombre = nombre; }
    setDescripcion(descripcion) { this.descripcion = descripcion; }
    setCosto(costo) { this.costo = costo; }
    setIcono(icono) { this.icono = icono; }
    setEstatusActivo(estatus_activo) { this.estatus_activo = estatus_activo; }
}

module.exports = Servicio;