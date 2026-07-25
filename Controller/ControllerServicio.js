const ServicioDAO = require('../Model/ServicioDAO');

class ControllerServicio {

    static listarServicios(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            ServicioDAO.buscar(criterio, (err, servicios) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                
                if (servicios.length === 0) {
                    return res.json({ success: true, servicios: [], mensaje: 'No se encontraron servicios que coincidan con la búsqueda' });
                }
                res.json({ success: true, servicios: servicios });
            });
        } else {
            ServicioDAO.obtenerTodos((err, servicios) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                res.json({ success: true, servicios: servicios });
            });
        }
    }

    static crearServicio(req, res) {
        const { nombre, descripcion, costo, icono, estatus_activo } = req.body;
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;

        // Validación de campos obligatorios basada en tu flujo alterno
        if (!nombre || !descripcion || !costo || !icono) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios' 
            });
        }

        const datosServicio = { 
            nombre, 
            descripcion, 
            costo, 
            icono, 
            estatus_activo: estatusActivo 
        };

        ServicioDAO.agregar(datosServicio, (err, idGenerado) => {
            if (err) {
                console.error('Error al crear servicio:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al registrar' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Servicio registrado correctamente',
                id: idGenerado
            });
        });
    }

    static eliminarServicio(req, res) {
        const id = req.params.id;

        ServicioDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar servicio:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            
            res.json({ success: true, mensaje: 'Servicio eliminado correctamente' });
        });
    }

    static obtenerServicio(req, res) {
        const id = req.params.id;

        ServicioDAO.obtenerPorId(id, (err, servicio) => {
            if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            if (servicio) return res.json({ success: true, servicio: servicio });
            
            return res.status(404).json({ success: false, mensaje: 'Servicio no encontrado' });
        });
    }

    static actualizarServicio(req, res) {
        const id = req.params.id;
        const { nombre, descripcion, costo, icono, estatus_activo } = req.body;
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;

        // Validación de campos obligatorios
        if (!nombre || !descripcion || !costo || !icono) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        const datosServicio = { 
            nombre, 
            descripcion, 
            costo, 
            icono, 
            estatus_activo: estatusActivo 
        };

        ServicioDAO.actualizar(id, datosServicio, (err, result) => {
            if (err) {
                console.error('Error al actualizar servicio:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Servicio actualizado correctamente' });
        });
    }
}

module.exports = ControllerServicio;