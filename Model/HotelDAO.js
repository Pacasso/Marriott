const db = require('./db');
const Hotel = require('./Hotel');

class HotelDAO {
    
    static obtenerTodos(callback) {
        // Doble JOIN para cruzar Hotel -> Destino -> Estado
        const query = `
            SELECT 
                h.*, 
                CONCAT(d.nombre, ', ', e.nombre) AS ubicacion_completa 
            FROM Hotel h
            INNER JOIN Destino d ON h.id_destino = d.id_destino
            INNER JOIN Estado e ON d.id_estado = e.id_estado
        `;
        
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const hotelesInstanciados = results.map(fila => {
                const hotelInstancia = new Hotel();
                
                hotelInstancia.setNombre(fila.nombre);
                hotelInstancia.setIdDestino(fila.id_destino);
                hotelInstancia.setHabitaciones(fila.habitaciones);
                hotelInstancia.setCategoria(fila.categoria);
                hotelInstancia.setTarifa(fila.tarifa);
                hotelInstancia.setServicios(fila.servicios);
                hotelInstancia.setPromociones(fila.promociones);
                hotelInstancia.setImagen(fila.imagen);
                hotelInstancia.setEstatusActivo(fila.estatus_activo);
                hotelInstancia.setIdHotel(fila.id_hotel);
                hotelInstancia.setUbicacionCompleta(fila.ubicacion_completa);
                
                return hotelInstancia;
            });

            return callback(null, hotelesInstanciados);
        });
    }

    static agregar(datos, callback) {
        const hotelInstancia = new Hotel();
        hotelInstancia.setNombre(datos.nombre);
        hotelInstancia.setIdDestino(datos.id_destino);
        hotelInstancia.setHabitaciones(datos.habitaciones);
        hotelInstancia.setCategoria(datos.categoria);
        hotelInstancia.setTarifa(datos.tarifa);
        hotelInstancia.setServicios(datos.servicios);
        hotelInstancia.setPromociones(datos.promociones);
        hotelInstancia.setImagen(datos.imagen);
        hotelInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);
        
        const query = `
            INSERT INTO Hotel 
            (nombre, id_destino, habitaciones, categoria, tarifa, servicios, promociones, imagen, estatus_activo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            hotelInstancia.getNombre(), 
            hotelInstancia.getIdDestino(), 
            hotelInstancia.getHabitaciones(), 
            hotelInstancia.getCategoria(), 
            hotelInstancia.getTarifa(),
            hotelInstancia.getServicios(),
            hotelInstancia.getPromociones(),
            hotelInstancia.getImagen(),
            hotelInstancia.getEstatusActivo()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Hotel WHERE id_hotel = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static obtenerPorId(id, callback) {
        const query = `
            SELECT 
                h.*, 
                CONCAT(d.nombre, ', ', e.nombre) AS ubicacion_completa 
            FROM Hotel h
            INNER JOIN Destino d ON h.id_destino = d.id_destino
            INNER JOIN Estado e ON d.id_estado = e.id_estado
            WHERE h.id_hotel = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                const hotelInstancia = new Hotel();
                
                hotelInstancia.setNombre(fila.nombre);
                hotelInstancia.setIdDestino(fila.id_destino);
                hotelInstancia.setHabitaciones(fila.habitaciones);
                hotelInstancia.setCategoria(fila.categoria);
                hotelInstancia.setTarifa(fila.tarifa);
                hotelInstancia.setServicios(fila.servicios);
                hotelInstancia.setPromociones(fila.promociones);
                hotelInstancia.setImagen(fila.imagen);
                hotelInstancia.setEstatusActivo(fila.estatus_activo);
                hotelInstancia.setIdHotel(fila.id_hotel);
                hotelInstancia.setUbicacionCompleta(fila.ubicacion_completa);
                
                return callback(null, hotelInstancia);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const hotelInstancia = new Hotel();
        hotelInstancia.setNombre(datos.nombre);
        hotelInstancia.setIdDestino(datos.id_destino);
        hotelInstancia.setHabitaciones(datos.habitaciones);
        hotelInstancia.setCategoria(datos.categoria);
        hotelInstancia.setTarifa(datos.tarifa);
        hotelInstancia.setServicios(datos.servicios);
        hotelInstancia.setPromociones(datos.promociones);
        hotelInstancia.setImagen(datos.imagen);
        hotelInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);
        hotelInstancia.setIdHotel(id);

        const query = `
            UPDATE Hotel SET 
                nombre = ?, id_destino = ?, habitaciones = ?, categoria = ?, 
                tarifa = ?, servicios = ?, promociones = ?, imagen = ?, estatus_activo = ? 
            WHERE id_hotel = ?
        `;
        
        db.query(query, [
            hotelInstancia.getNombre(), 
            hotelInstancia.getIdDestino(), 
            hotelInstancia.getHabitaciones(), 
            hotelInstancia.getCategoria(), 
            hotelInstancia.getTarifa(),
            hotelInstancia.getServicios(),
            hotelInstancia.getPromociones(),
            hotelInstancia.getImagen(),
            hotelInstancia.getEstatusActivo(),
            hotelInstancia.getIdHotel()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT 
                h.*, 
                CONCAT(d.nombre, ', ', e.nombre) AS ubicacion_completa 
            FROM Hotel h
            INNER JOIN Destino d ON h.id_destino = d.id_destino
            INNER JOIN Estado e ON d.id_estado = e.id_estado
            WHERE h.id_hotel = ? OR h.nombre LIKE ? OR d.nombre LIKE ?
        `;
        
        db.query(query, [criterio, `%${criterio}%`, `%${criterio}%`], (err, results) => {
            if (err) return callback(err, null);
            
            const hotelesInstanciados = results.map(fila => {
                const hotelInstancia = new Hotel();
                
                hotelInstancia.setNombre(fila.nombre);
                hotelInstancia.setIdDestino(fila.id_destino);
                hotelInstancia.setHabitaciones(fila.habitaciones);
                hotelInstancia.setCategoria(fila.categoria);
                hotelInstancia.setTarifa(fila.tarifa);
                hotelInstancia.setServicios(fila.servicios);
                hotelInstancia.setPromociones(fila.promociones);
                hotelInstancia.setImagen(fila.imagen);
                hotelInstancia.setEstatusActivo(fila.estatus_activo);
                hotelInstancia.setIdHotel(fila.id_hotel);
                hotelInstancia.setUbicacionCompleta(fila.ubicacion_completa);
                
                return hotelInstancia;
            });

            return callback(null, hotelesInstanciados);
        });
    }
}

module.exports = HotelDAO;