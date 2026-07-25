const db = require('./db');
const Habitacion = require('./Habitacion');

class HabitacionDAO {
    
    static obtenerTodos(callback) {
        const query = `
            SELECT h.*, hot.nombre AS nombre_hotel 
            FROM Habitacion h
            INNER JOIN Hotel hot ON h.id_hotel = hot.id_hotel
        `;
        
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const habitacionesInstanciadas = results.map(fila => {
                const habitacion = new Habitacion();
                
                habitacion.setIdHabitacion(fila.id_habitacion);
                habitacion.setIdHotel(fila.id_hotel);
                habitacion.setNumero(fila.numero);
                habitacion.setCategoria(fila.categoria);
                habitacion.setCapacidad(fila.capacidad);
                habitacion.setTarifa(fila.tarifa);
                habitacion.setEstatus(fila.estatus);
                habitacion.setNombreHotel(fila.nombre_hotel);
                
                return habitacion;
            });

            return callback(null, habitacionesInstanciadas);
        });
    }

    static agregar(datos, callback) {
        const habitacion = new Habitacion();
        habitacion.setIdHotel(datos.id_hotel);
        habitacion.setNumero(datos.numero);
        habitacion.setCategoria(datos.categoria);
        habitacion.setCapacidad(datos.capacidad);
        habitacion.setTarifa(datos.tarifa);
        habitacion.setEstatus(datos.estatus || 'Disponible');
        
        const query = `
            INSERT INTO Habitacion 
            (id_hotel, numero, categoria, capacidad, tarifa, estatus) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            habitacion.getIdHotel(), 
            habitacion.getNumero(), 
            habitacion.getCategoria(), 
            habitacion.getCapacidad(),
            habitacion.getTarifa(),
            habitacion.getEstatus()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static obtenerPorId(id, callback) {
        const query = `
            SELECT h.*, hot.nombre AS nombre_hotel 
            FROM Habitacion h
            INNER JOIN Hotel hot ON h.id_hotel = hot.id_hotel 
            WHERE h.id_habitacion = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                const habitacion = new Habitacion();
                
                habitacion.setIdHabitacion(fila.id_habitacion);
                habitacion.setIdHotel(fila.id_hotel);
                habitacion.setNumero(fila.numero);
                habitacion.setCategoria(fila.categoria);
                habitacion.setCapacidad(fila.capacidad);
                habitacion.setTarifa(fila.tarifa);
                habitacion.setEstatus(fila.estatus);
                habitacion.setNombreHotel(fila.nombre_hotel);
                
                return callback(null, habitacion);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const habitacion = new Habitacion();
        habitacion.setIdHabitacion(id);
        habitacion.setIdHotel(datos.id_hotel);
        habitacion.setNumero(datos.numero);
        habitacion.setCategoria(datos.categoria);
        habitacion.setCapacidad(datos.capacidad);
        habitacion.setTarifa(datos.tarifa);
        habitacion.setEstatus(datos.estatus);

        const query = `
            UPDATE Habitacion SET 
                id_hotel = ?, numero = ?, categoria = ?, capacidad = ?, tarifa = ?, estatus = ? 
            WHERE id_habitacion = ?
        `;
        
        db.query(query, [
            habitacion.getIdHotel(), 
            habitacion.getNumero(), 
            habitacion.getCategoria(), 
            habitacion.getCapacidad(),
            habitacion.getTarifa(),
            habitacion.getEstatus(),
            habitacion.getIdHabitacion()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Habitacion WHERE id_habitacion = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT h.*, hot.nombre AS nombre_hotel 
            FROM Habitacion h
            INNER JOIN Hotel hot ON h.id_hotel = hot.id_hotel
            WHERE h.numero LIKE ? OR h.categoria LIKE ? OR hot.nombre LIKE ?
        `;
        
        db.query(query, [`%${criterio}%`, `%${criterio}%`, `%${criterio}%`], (err, results) => {
            if (err) return callback(err, null);
            
            const habitacionesInstanciadas = results.map(fila => {
                const habitacion = new Habitacion();
                
                habitacion.setIdHabitacion(fila.id_habitacion);
                habitacion.setIdHotel(fila.id_hotel);
                habitacion.setNumero(fila.numero);
                habitacion.setCategoria(fila.categoria);
                habitacion.setCapacidad(fila.capacidad);
                habitacion.setTarifa(fila.tarifa);
                habitacion.setEstatus(fila.estatus);
                habitacion.setNombreHotel(fila.nombre_hotel);
                
                return habitacion;
            });

            return callback(null, habitacionesInstanciadas);
        });
    }
}

module.exports = HabitacionDAO;