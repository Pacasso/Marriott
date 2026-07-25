const db = require('./db');
const Servicio = require('./Servicio');

class ServicioDAO {
    
    static obtenerTodos(callback) {
        const query = 'SELECT * FROM Servicio';
        
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const serviciosInstanciados = results.map(fila => {
                const servicioInstancia = new Servicio();
                
                servicioInstancia.setIdServicio(fila.id_servicio);
                servicioInstancia.setNombre(fila.nombre);
                servicioInstancia.setDescripcion(fila.descripcion);
                servicioInstancia.setCosto(fila.costo);
                servicioInstancia.setIcono(fila.icono);
                servicioInstancia.setEstatusActivo(fila.estatus_activo);
                
                return servicioInstancia;
            });

            return callback(null, serviciosInstanciados);
        });
    }

    static agregar(datos, callback) {
        const servicioInstancia = new Servicio();
        servicioInstancia.setNombre(datos.nombre);
        servicioInstancia.setDescripcion(datos.descripcion);
        servicioInstancia.setCosto(datos.costo);
        servicioInstancia.setIcono(datos.icono);
        servicioInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);
        
        const query = `
            INSERT INTO Servicio 
            (nombre, descripcion, costo, icono, estatus_activo) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            servicioInstancia.getNombre(), 
            servicioInstancia.getDescripcion(), 
            servicioInstancia.getCosto(), 
            servicioInstancia.getIcono(), 
            servicioInstancia.getEstatusActivo()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static obtenerPorId(id, callback) {
        const query = 'SELECT * FROM Servicio WHERE id_servicio = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                const servicioInstancia = new Servicio();
                
                servicioInstancia.setIdServicio(fila.id_servicio);
                servicioInstancia.setNombre(fila.nombre);
                servicioInstancia.setDescripcion(fila.descripcion);
                servicioInstancia.setCosto(fila.costo);
                servicioInstancia.setIcono(fila.icono);
                servicioInstancia.setEstatusActivo(fila.estatus_activo);
                
                return callback(null, servicioInstancia);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const servicioInstancia = new Servicio();
        servicioInstancia.setIdServicio(id);
        servicioInstancia.setNombre(datos.nombre);
        servicioInstancia.setDescripcion(datos.descripcion);
        servicioInstancia.setCosto(datos.costo);
        servicioInstancia.setIcono(datos.icono);
        servicioInstancia.setEstatusActivo(datos.estatus_activo !== undefined ? datos.estatus_activo : 1);

        const query = `
            UPDATE Servicio SET 
                nombre = ?, descripcion = ?, costo = ?, icono = ?, estatus_activo = ? 
            WHERE id_servicio = ?
        `;
        
        db.query(query, [
            servicioInstancia.getNombre(), 
            servicioInstancia.getDescripcion(), 
            servicioInstancia.getCosto(), 
            servicioInstancia.getIcono(),
            servicioInstancia.getEstatusActivo(),
            servicioInstancia.getIdServicio()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Servicio WHERE id_servicio = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT * FROM Servicio 
            WHERE id_servicio = ? OR nombre LIKE ? OR descripcion LIKE ?
        `;
        
        db.query(query, [criterio, `%${criterio}%`, `%${criterio}%`], (err, results) => {
            if (err) return callback(err, null);
            
            const serviciosInstanciados = results.map(fila => {
                const servicioInstancia = new Servicio();
                
                servicioInstancia.setIdServicio(fila.id_servicio);
                servicioInstancia.setNombre(fila.nombre);
                servicioInstancia.setDescripcion(fila.descripcion);
                servicioInstancia.setCosto(fila.costo);
                servicioInstancia.setIcono(fila.icono);
                servicioInstancia.setEstatusActivo(fila.estatus_activo);
                
                return servicioInstancia;
            });

            return callback(null, serviciosInstanciados);
        });
    }
}

module.exports = ServicioDAO;