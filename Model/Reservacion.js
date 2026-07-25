class Reservacion {
    constructor(id_reservacion, id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total, estado_reserva, nombre_huesped = '', nombre_hotel = '', numero_habitacion = '') {
        this.id_reservacion = id_reservacion;
        this.id_usuario = id_usuario;
        this.id_habitacion = id_habitacion;
        this.fecha_entrada = fecha_entrada;
        this.fecha_salida = fecha_salida;
        this.costo_total = costo_total;
        this.estado_reserva = estado_reserva;
        
        this.nombre_huesped = nombre_huesped;
        this.nombre_hotel = nombre_hotel;
        this.numero_habitacion = numero_habitacion;
    }

    // Getters
    getIdReservacion() { return this.id_reservacion; }
    getIdUsuario() { return this.id_usuario; }
    getIdHabitacion() { return this.id_habitacion; }
    getFechaEntrada() { return this.fecha_entrada; }
    getFechaSalida() { return this.fecha_salida; }
    getCostoTotal() { return this.costo_total; }
    getEstadoReserva() { return this.estado_reserva; }
    getNombreHuesped() { return this.nombre_huesped; }
    getNombreHotel() { return this.nombre_hotel; }
    getNumeroHabitacion() { return this.numero_habitacion; }

    // Setters
    setIdReservacion(id_reservacion) { this.id_reservacion = id_reservacion; }
    setIdUsuario(id_usuario) { this.id_usuario = id_usuario; }
    setIdHabitacion(id_habitacion) { this.id_habitacion = id_habitacion; }
    setFechaEntrada(fecha_entrada) { this.fecha_entrada = fecha_entrada; }
    setFechaSalida(fecha_salida) { this.fecha_salida = fecha_salida; }
    setCostoTotal(costo_total) { this.costo_total = costo_total; }
    setEstadoReserva(estado_reserva) { this.estado_reserva = estado_reserva; }
    setNombreHuesped(nombre_huesped) { this.nombre_huesped = nombre_huesped; }
    setNombreHotel(nombre_hotel) { this.nombre_hotel = nombre_hotel; }
    setNumeroHabitacion(numero_habitacion) { this.numero_habitacion = numero_habitacion; }
}

module.exports = Reservacion;