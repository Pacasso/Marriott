const UsuarioDAO = require('../Model/UsuarioDAO');

class ControllerUsuario {

    static iniciarSesion(req, res) {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
        return res.status(400).json({ 
            success: false, 
            mensaje: 'Por favor, ingrese su correo y contraseña' 
        });
    }

    UsuarioDAO.autenticar(correo, contrasena, (err, usuario) => {
        if (err) {
            console.error('Error en base de datos:', err);
            return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
        }

        if (usuario) {
            res.json({ 
                success: true, 
                mensaje: 'Inicio de sesión exitoso', 
                usuario: usuario 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                mensaje: 'Credenciales incorrectas o cuenta inactiva' 
            });
        }
    });
}

    static listarUsuarios(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            UsuarioDAO.buscar(criterio, (err, usuarios) => {
                if (err) {
                    console.error('Error al buscar usuarios:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                
                // Flujo Alterno: Búsqueda sin coincidencias
                if (usuarios.length === 0) {
                    return res.json({ success: true, usuarios: [], mensaje: 'No se encontraron usuarios que coincidan con la búsqueda' });
                }
                res.json({ success: true, usuarios: usuarios });
            });
        } else {
            UsuarioDAO.obtenerTodos((err, usuarios) => {
                if (err) {
                    console.error('Error al obtener usuarios:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                res.json({ success: true, usuarios: usuarios });
            });
        }
    }

    static crearUsuario(req, res) {
        const { id_rol, nombre_completo, correo_electronico, contrasena, estatus } = req.body;

        // Flujo Alterno: Validación de campos obligatorios
        if (!id_rol || !nombre_completo || !correo_electronico || !contrasena) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios' 
            });
        }

        const datosUsuario = { 
            id_rol: Number(id_rol), 
            nombre_completo, 
            correo_electronico, 
            contrasena, 
            estatus 
        };

        UsuarioDAO.agregar(datosUsuario, (err, idGenerado) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, mensaje: 'El correo electrónico ingresado ya se encuentra registrado. Por favor, utilice uno diferente.' });
                }
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al registrar' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Usuario registrado correctamente',
                id: idGenerado
            });
        });
    }

    static obtenerUsuario(req, res) {
        const id = req.params.id;

        UsuarioDAO.obtenerPorId(id, (err, usuario) => {
            if (err) {
                console.error('Error al obtener usuario:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            if (usuario) {
                // Por seguridad extra al enviar a la vista de edición, omitimos mandar la contraseña
                usuario.contrasena = undefined; 
                return res.json({ success: true, usuario: usuario });
            }
            
            return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
        });
    }

    static actualizarUsuario(req, res) {
        const id = req.params.id;
        const { id_rol, nombre_completo, correo_electronico, estatus } = req.body;

        // Validación de campos obligatorios (sin requerir la contraseña)
        if (!id_rol || !nombre_completo || !correo_electronico) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        const datosUsuario = { 
            id_rol: Number(id_rol), 
            nombre_completo, 
            correo_electronico, 
            estatus 
        };

        UsuarioDAO.actualizar(id, datosUsuario, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, mensaje: 'El correo electrónico ingresado ya pertenece a otro usuario.' });
                }
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Usuario actualizado correctamente' });
        });
    }

    static eliminarUsuario(req, res) {
        const id = req.params.id;
        
        

        UsuarioDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar usuario:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al eliminar' });
            }
            
            res.json({ success: true, mensaje: 'Usuario eliminado correctamente' });
        });
    }
}

module.exports = ControllerUsuario;