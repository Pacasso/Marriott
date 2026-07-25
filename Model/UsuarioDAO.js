const db = require('./db');
const Usuario = require('./Usuario');

class UsuarioDAO {

    static autenticar(correo, contrasena, callback) {
    const query = `
        SELECT u.id_usuario, u.nombre_completo, u.correo_electronico, u.id_rol, r.nombre_rol, u.estatus 
        FROM Usuario u
        INNER JOIN Rol r ON u.id_rol = r.id_rol
        WHERE u.correo_electronico = ? AND u.contrasena = ? AND u.estatus = 'Activo'
    `;
    
    db.query(query, [correo, contrasena], (err, results) => {
        if (err) return callback(err, null);
        
        if (results.length > 0) {
            const fila = results[0];
            const usuarioInstancia = new Usuario();
            
            usuarioInstancia.setIdUsuario(fila.id_usuario);
            usuarioInstancia.setNombreCompleto(fila.nombre_completo);
            usuarioInstancia.setCorreoElectronico(fila.correo_electronico);
            usuarioInstancia.setIdRol(fila.id_rol);
            usuarioInstancia.setNombreRol(fila.nombre_rol);
            usuarioInstancia.setEstatus(fila.estatus);
            
            return callback(null, usuarioInstancia);
        } else {
            return callback(null, null);
        }
    });
}
    
    static obtenerTodos(callback) {
        const query = `
            SELECT u.*, r.nombre_rol 
            FROM Usuario u
            INNER JOIN Rol r ON u.id_rol = r.id_rol
        `;
        
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            
            const usuariosInstanciados = results.map(fila => {
                const usuario = new Usuario();
                
                usuario.setIdUsuario(fila.id_usuario);
                usuario.setIdRol(fila.id_rol);
                usuario.setNombreCompleto(fila.nombre_completo);
                usuario.setCorreoElectronico(fila.correo_electronico);
                usuario.setContrasena(fila.contrasena);
                usuario.setEstatus(fila.estatus);
                usuario.setNombreRol(fila.nombre_rol);
                
                return usuario;
            });

            return callback(null, usuariosInstanciados);
        });
    }

    static agregar(datos, callback) {
        const usuario = new Usuario();
        usuario.setIdRol(datos.id_rol);
        usuario.setNombreCompleto(datos.nombre_completo);
        usuario.setCorreoElectronico(datos.correo_electronico);
        usuario.setContrasena(datos.contrasena);
        usuario.setEstatus(datos.estatus || 'Activo');
        
        const query = `
            INSERT INTO Usuario 
            (id_rol, nombre_completo, correo_electronico, contrasena, estatus) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            usuario.getIdRol(), 
            usuario.getNombreCompleto(), 
            usuario.getCorreoElectronico(), 
            usuario.getContrasena(),
            usuario.getEstatus()
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results.insertId);
        });
    }

    static obtenerPorId(id, callback) {
        const query = `
            SELECT u.*, r.nombre_rol 
            FROM Usuario u
            INNER JOIN Rol r ON u.id_rol = r.id_rol 
            WHERE u.id_usuario = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            
            if (results.length > 0) {
                const fila = results[0];
                const usuario = new Usuario();
                
                usuario.setIdUsuario(fila.id_usuario);
                usuario.setIdRol(fila.id_rol);
                usuario.setNombreCompleto(fila.nombre_completo);
                usuario.setCorreoElectronico(fila.correo_electronico);
                usuario.setContrasena(fila.contrasena);
                usuario.setEstatus(fila.estatus);
                usuario.setNombreRol(fila.nombre_rol);
                
                return callback(null, usuario);
            }
            
            return callback(null, null);
        });
    }

    static actualizar(id, datos, callback) {
        const query = `
            UPDATE Usuario SET 
                id_rol = ?, nombre_completo = ?, correo_electronico = ?, estatus = ?
            WHERE id_usuario = ?
        `;
        
        db.query(query, [
            datos.id_rol, 
            datos.nombre_completo, 
            datos.correo_electronico, 
            datos.estatus,
            id
        ], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static eliminar(id, callback) {
        const query = 'DELETE FROM Usuario WHERE id_usuario = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }

    static buscar(criterio, callback) {
        const query = `
            SELECT u.*, r.nombre_rol 
            FROM Usuario u
            INNER JOIN Rol r ON u.id_rol = r.id_rol
            WHERE u.nombre_completo LIKE ? OR u.correo_electronico LIKE ? OR r.nombre_rol LIKE ?
        `;
        
        const likeCriterio = `%${criterio}%`;
        db.query(query, [likeCriterio, likeCriterio, likeCriterio], (err, results) => {
            if (err) return callback(err, null);
            
            const usuariosInstanciados = results.map(fila => {
                const usuario = new Usuario();
                
                usuario.setIdUsuario(fila.id_usuario);
                usuario.setIdRol(fila.id_rol);
                usuario.setNombreCompleto(fila.nombre_completo);
                usuario.setCorreoElectronico(fila.correo_electronico);
                usuario.setContrasena(fila.contrasena);
                usuario.setEstatus(fila.estatus);
                usuario.setNombreRol(fila.nombre_rol);
                
                return usuario;
            });

            return callback(null, usuariosInstanciados);
        });
    }
}

module.exports = UsuarioDAO;