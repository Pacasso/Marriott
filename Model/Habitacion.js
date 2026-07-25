class Habitacion {
    constructor(id_habitacion, id_hotel, numero, categoria, capacidad, tarifa, estatus, nombre_hotel = '') {
        this.id_habitacion = id_habitacion;
        this.id_hotel = id_hotel;
        this.numero = numero;
        this.categoria = categoria;
        this.capacidad = capacidad;
        this.tarifa = tarifa;
        this.estatus = estatus;
        this.nombre_hotel = nombre_hotel;
    }

    getIdHabitacion() { return this.id_habitacion; }
    getIdHotel() { return this.id_hotel; }
    getNumero() { return this.numero; }
    getCategoria() { return this.categoria; }
    getCapacidad() { return this.capacidad; }
    getTarifa() { return this.tarifa; }
    getEstatus() { return this.estatus; }
    getNombreHotel() { return this.nombre_hotel; }

    setIdHabitacion(id_habitacion) { this.id_habitacion = id_habitacion; }
    setIdHotel(id_hotel) { this.id_hotel = id_hotel; }
    setNumero(numero) { this.numero = numero; }
    setCategoria(categoria) { this.categoria = categoria; }
    setCapacidad(capacidad) { this.capacidad = capacidad; }
    setTarifa(tarifa) { this.tarifa = tarifa; }
    setEstatus(estatus) { this.estatus = estatus; }
    setNombreHotel(nombre_hotel) { this.nombre_hotel = nombre_hotel; }
}

module.exports = Habitacion;