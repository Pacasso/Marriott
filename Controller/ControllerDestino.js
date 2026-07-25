const DestinoDAO = require('../Model/DestinoDAO');

class ControllerDestino {

    static listarDestinos(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            DestinoDAO.buscar(criterio, (err, destinos) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                
                if (destinos.length === 0) {
                    return res.json({ success: true, destinos: [], mensaje: 'No se encontraron destinos que coincidan con la búsqueda' });
                }
                res.json({ success: true, destinos: destinos });
            });
        } else {
            DestinoDAO.obtenerTodos((err, destinos) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                res.json({ success: true, destinos: destinos });
            });
        }
    }

    static crearDestino(req, res) {
        // Sustituimos ubicacion por id_estado
        const { nombre, id_estado, descripcion, atracciones, estatus_activo } = req.body;
        const imagen = req.file ? req.file.filename : '';
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;

        // Validamos que id_estado no venga vacío
        if (!nombre || !id_estado || !descripcion || !atracciones || !imagen) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios' 
            });
        }

        // Empaquetamos los datos con el nuevo atributo
        const datosDestino = { nombre, id_estado, descripcion, atracciones, imagen, estatus_activo: estatusActivo };

        DestinoDAO.agregar(datosDestino, (err, idGenerado) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Destino registrado correctamente',
                id: idGenerado
            });
        });
    }

    static eliminarDestino(req, res) {
        const id = req.params.id;

        DestinoDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            
            res.json({ success: true, mensaje: 'Destino eliminado correctamente' });
        });
    }

    static obtenerDestino(req, res) {
        const id = req.params.id;

        DestinoDAO.obtenerPorId(id, (err, destino) => {
            if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            if (destino) return res.json({ success: true, destino: destino });
            
            return res.status(404).json({ success: false, mensaje: 'Destino no encontrado' });
        });
    }

    static actualizarDestino(req, res) {
        const id = req.params.id;
        // Sustituimos ubicacion por id_estado
        const { nombre, id_estado, descripcion, atracciones, estatus_activo } = req.body;
        const imagen = req.file ? req.file.filename : (req.body.imagenActual || '');
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;

        // Validamos id_estado
        if (!nombre || !id_estado || !descripcion || !atracciones) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        // Empaquetamos los datos con el nuevo atributo
        const datosDestino = { nombre, id_estado, descripcion, atracciones, imagen, estatus_activo: estatusActivo };

        DestinoDAO.actualizar(id, datosDestino, (err, result) => {
            if (err) {
                console.error('❌ Error en el DAO al actualizar destino:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Destino actualizado correctamente' });
        });
    }
}

module.exports = ControllerDestino;