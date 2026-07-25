const db = require('./db');
const Destino = require('./Destino'); 

class DestinoDAO {
    
    static obtenerTodos(callback) {
        const query = `
            SELECT d.*, e.nombre AS nombre_estado 
            FROM Destino d 
            INNER JOIN Estado e ON d.id_estado = e.id_estado
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const destinosInstanciados = results.map(fila => {
                const destinoInstancia = new Destino();
                
                destinoInstancia.setNombre(fila.nombre);
                destinoInstancia.setIdEstado(fila.id_estado);
                destinoInstancia.setDescripcion(fila.descripcion);
                destinoInstancia.setAtracciones(fila.atracciones);
                destinoInstancia.setImagen(fila.imagen);
                destinoInstancia.setEstatusActivo(fila.estatus_activo);
                destinoInstancia.setIdDestino(fila.id_destino);
                destinoInstancia.setNombreEstado(fila.nombre_estado);
                
                return destinoInstancia;
            });

            return callback(null, destinosInstanciados);
        });
    }

    static agregar(datos, callback) {
        
        const destinoInstancia = new Destino();
        destinoInstancia.setNombre(datos.nombre);
        destinoInstancia.setIdEstado(datos.id_estado); 
        destinoInstancia.setDescripcion(datos.descripcion);
        destinoInstancia.setAtracciones(datos.atracciones);
        destinoInstancia.setImagen(datos.imagen);
        destinoInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);
        
        const query = 'INSERT INTO Destino (nombre, id_estado, descripcion, atracciones, imagen, estatus_activo) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [
            destinoInstancia.getNombre(), 
            destinoInstancia.getIdEstado(), 
            destinoInstancia.getDescripcion(), 
            destinoInstancia.getAtracciones(), 
            destinoInstancia.getImagen(),
            destinoInstancia.getEstatusActivo()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Destino WHERE id_destino = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static obtenerPorId(id, callback) {
        const query = `
            SELECT d.*, e.nombre AS nombre_estado 
            FROM Destino d 
            INNER JOIN Estado e ON d.id_estado = e.id_estado 
            WHERE d.id_destino = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                
                const destinoInstancia = new Destino();
                
                destinoInstancia.setNombre(fila.nombre);
                destinoInstancia.setIdEstado(fila.id_estado);
                destinoInstancia.setDescripcion(fila.descripcion);
                destinoInstancia.setAtracciones(fila.atracciones);
                destinoInstancia.setImagen(fila.imagen);
                destinoInstancia.setEstatusActivo(fila.estatus_activo);
                destinoInstancia.setIdDestino(fila.id_destino);
                destinoInstancia.setNombreEstado(fila.nombre_estado);
                
                return callback(null, destinoInstancia);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const destinoInstancia = new Destino();
        destinoInstancia.setNombre(datos.nombre);
        destinoInstancia.setIdEstado(datos.id_estado);
        destinoInstancia.setDescripcion(datos.descripcion);
        destinoInstancia.setAtracciones(datos.atracciones);
        destinoInstancia.setImagen(datos.imagen);
        destinoInstancia.setIdDestino(id); // <-- Aquí ya estaba bien escrito
        destinoInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);

        const query = 'UPDATE Destino SET nombre = ?, id_estado = ?, descripcion = ?, atracciones = ?, imagen = ?, estatus_activo = ? WHERE id_destino = ?';
        db.query(query, [
            destinoInstancia.getNombre(), 
            destinoInstancia.getIdEstado(), 
            destinoInstancia.getDescripcion(), 
            destinoInstancia.getAtracciones(), 
            destinoInstancia.getImagen(),
            destinoInstancia.getEstatusActivo(),
            destinoInstancia.getIdDestino()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT d.*, e.nombre AS nombre_estado 
            FROM Destino d 
            INNER JOIN Estado e ON d.id_estado = e.id_estado 
            WHERE d.id_destino = ? OR d.nombre LIKE ?
        `;
        
        db.query(query, [criterio, `%${criterio}%`], (err, results) => {
            if (err) return callback(err, null);
            
            const destinosInstanciados = results.map(fila => {
                const destinoInstancia = new Destino();
                
                destinoInstancia.setNombre(fila.nombre);
                destinoInstancia.setIdEstado(fila.id_estado);
                destinoInstancia.setDescripcion(fila.descripcion);
                destinoInstancia.setAtracciones(fila.atracciones);
                destinoInstancia.setImagen(fila.imagen);
                destinoInstancia.setEstatusActivo(fila.estatus_activo);               
                destinoInstancia.setIdDestino(fila.id_destino); 
                destinoInstancia.setNombreEstado(fila.nombre_estado);
                
                return destinoInstancia;
            });

            return callback(null, destinosInstanciados);
        });
    }
}

module.exports = DestinoDAO;