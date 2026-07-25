class Hotel {
    constructor(nombre, id_destino, habitaciones, categoria, tarifa, servicios, promociones, imagen, estatus_activo) {
        this.nombre = nombre;
        this.id_destino = id_destino;
        this.habitaciones = habitaciones;
        this.categoria = categoria;
        this.tarifa = tarifa;
        this.servicios = servicios;
        this.promociones = promociones;
        this.imagen = imagen;
        this.estatus_activo = estatus_activo;
    }

    getNombre() { return this.nombre; }
    getIdDestino() { return this.id_destino; }
    getHabitaciones() { return this.habitaciones; }
    getCategoria() { return this.categoria; }
    getTarifa() { return this.tarifa; }
    getServicios() { return this.servicios; }
    getPromociones() { return this.promociones; }
    getImagen() { return this.imagen; }
    getEstatusActivo() { return this.estatus_activo; }
    getIdHotel() { return this.id_hotel; }
    getUbicacionCompleta() { return this.ubicacion_completa; }

    setNombre(nombre) { this.nombre = nombre; }
    setIdDestino(id_destino) { this.id_destino = id_destino; }
    setHabitaciones(habitaciones) { this.habitaciones = habitaciones; }
    setCategoria(categoria) { this.categoria = categoria; }
    setTarifa(tarifa) { this.tarifa = tarifa; }
    setServicios(servicios) { this.servicios = servicios; }
    setPromociones(promociones) { this.promociones = promociones; }
    setImagen(imagen) { this.imagen = imagen; }
    setEstatusActivo(estatus_activo) { this.estatus_activo = estatus_activo; }
    setIdHotel(id_hotel) { this.id_hotel = id_hotel; }
    setUbicacionCompleta(ubicacion_completa) { this.ubicacion_completa = ubicacion_completa; }
}

module.exports = Hotel;