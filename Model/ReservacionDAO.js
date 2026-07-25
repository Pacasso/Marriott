const db = require('./db');
const Reservacion = require('./Reservacion');

class ReservacionDAO {
    
    static obtenerTodos(callback) {
        const query = `
            SELECT r.*, u.nombre_completo AS nombre_huesped, h.nombre AS nombre_hotel, hab.numero AS numero_habitacion 
            FROM Reservacion r
            INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
            INNER JOIN Habitacion hab ON r.id_habitacion = hab.id_habitacion
            INNER JOIN Hotel h ON hab.id_hotel = h.id_hotel
            ORDER BY r.fecha_entrada DESC
        `;
        
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const reservacionesInstanciadas = results.map(fila => {
                const reservacion = new Reservacion();
                
                reservacion.setIdReservacion(fila.id_reservacion);
                reservacion.setIdUsuario(fila.id_usuario);
                reservacion.setIdHabitacion(fila.id_habitacion);
                reservacion.setFechaEntrada(fila.fecha_entrada);
                reservacion.setFechaSalida(fila.fecha_salida);
                reservacion.setCostoTotal(fila.costo_total);
                reservacion.setEstadoReserva(fila.estado_reserva);
                reservacion.setNombreHuesped(fila.nombre_huesped);
                reservacion.setNombreHotel(fila.nombre_hotel);
                reservacion.setNumeroHabitacion(fila.numero_habitacion);
                
                return reservacion;
            });

            return callback(null, reservacionesInstanciadas);
        });
    }

    static agregar(datos, callback) {
        const reservacion = new Reservacion();
        reservacion.setIdUsuario(datos.id_usuario);
        reservacion.setIdHabitacion(datos.id_habitacion);
        reservacion.setFechaEntrada(datos.fecha_entrada);
        reservacion.setFechaSalida(datos.fecha_salida);
        reservacion.setCostoTotal(datos.costo_total);
        reservacion.setEstadoReserva(datos.estado_reserva || 'Pendiente');
        
        const query = `
            INSERT INTO Reservacion 
            (id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total, estado_reserva) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            reservacion.getIdUsuario(), 
            reservacion.getIdHabitacion(), 
            reservacion.getFechaEntrada(), 
            reservacion.getFechaSalida(),
            reservacion.getCostoTotal(),
            reservacion.getEstadoReserva()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static obtenerPorId(id, callback) {
        const query = `
            SELECT r.*, u.nombre_completo AS nombre_huesped, h.nombre AS nombre_hotel, hab.numero AS numero_habitacion 
            FROM Reservacion r
            INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
            INNER JOIN Habitacion hab ON r.id_habitacion = hab.id_habitacion
            INNER JOIN Hotel h ON hab.id_hotel = h.id_hotel
            WHERE r.id_reservacion = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                const reservacion = new Reservacion();
                
                reservacion.setIdReservacion(fila.id_reservacion);
                reservacion.setIdUsuario(fila.id_usuario);
                reservacion.setIdHabitacion(fila.id_habitacion);
                reservacion.setFechaEntrada(fila.fecha_entrada);
                reservacion.setFechaSalida(fila.fecha_salida);
                reservacion.setCostoTotal(fila.costo_total);
                reservacion.setEstadoReserva(fila.estado_reserva);
                reservacion.setNombreHuesped(fila.nombre_huesped);
                reservacion.setNombreHotel(fila.nombre_hotel);
                reservacion.setNumeroHabitacion(fila.numero_habitacion);
                
                return callback(null, reservacion);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const reservacion = new Reservacion();
        reservacion.setIdReservacion(id);
        reservacion.setIdUsuario(datos.id_usuario);
        reservacion.setIdHabitacion(datos.id_habitacion);
        reservacion.setFechaEntrada(datos.fecha_entrada);
        reservacion.setFechaSalida(datos.fecha_salida);
        reservacion.setCostoTotal(datos.costo_total);
        reservacion.setEstadoReserva(datos.estado_reserva);

        const query = `
            UPDATE Reservacion SET 
                id_usuario = ?, id_habitacion = ?, fecha_entrada = ?, fecha_salida = ?, costo_total = ?, estado_reserva = ? 
            WHERE id_reservacion = ?
        `;
        
        db.query(query, [
            reservacion.getIdUsuario(), 
            reservacion.getIdHabitacion(), 
            reservacion.getFechaEntrada(), 
            reservacion.getFechaSalida(),
            reservacion.getCostoTotal(),
            reservacion.getEstadoReserva(),
            reservacion.getIdReservacion()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Reservacion WHERE id_reservacion = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT r.*, u.nombre_completo AS nombre_huesped, h.nombre AS nombre_hotel, hab.numero AS numero_habitacion 
            FROM Reservacion r
            INNER JOIN Usuario u ON r.id_usuario = u.id_usuario
            INNER JOIN Habitacion hab ON r.id_habitacion = hab.id_habitacion
            INNER JOIN Hotel h ON hab.id_hotel = h.id_hotel
            WHERE r.id_reservacion LIKE ? OR u.nombre_completo LIKE ? OR r.estado_reserva LIKE ?
        `;
        
        db.query(query, [`%${criterio}%`, `%${criterio}%`, `%${criterio}%`], (err, results) => {
            if (err) return callback(err, null);
            
            const reservacionesInstanciadas = results.map(fila => {
                const reservacion = new Reservacion();
                
                reservacion.setIdReservacion(fila.id_reservacion);
                reservacion.setIdUsuario(fila.id_usuario);
                reservacion.setIdHabitacion(fila.id_habitacion);
                reservacion.setFechaEntrada(fila.fecha_entrada);
                reservacion.setFechaSalida(fila.fecha_salida);
                reservacion.setCostoTotal(fila.costo_total);
                reservacion.setEstadoReserva(fila.estado_reserva);
                reservacion.setNombreHuesped(fila.nombre_huesped);
                reservacion.setNombreHotel(fila.nombre_hotel);
                reservacion.setNumeroHabitacion(fila.numero_habitacion);
                
                return reservacion;
            });

            return callback(null, reservacionesInstanciadas);
        });
    }
}

module.exports = ReservacionDAO;
