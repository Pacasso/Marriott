const ReservacionDAO = require('../Model/ReservacionDAO');

class ControllerReservacion {

    static listarReservaciones(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            ReservacionDAO.buscar(criterio, (err, reservaciones) => {
                if (err) {
                    console.error('Error al buscar reservaciones:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                
                if (reservaciones.length === 0) {
                    return res.json({ success: true, reservaciones: [], mensaje: 'No se encontraron reservaciones que coincidan con la búsqueda' });
                }
                res.json({ success: true, reservaciones: reservaciones });
            });
        } else {
            ReservacionDAO.obtenerTodos((err, reservaciones) => {
                if (err) {
                    console.error('Error al obtener reservaciones:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                res.json({ success: true, reservaciones: reservaciones });
            });
        }
    }

    static crearReservacion(req, res) {
        const { id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total, estado_reserva } = req.body;

        // Flujo Alterno: Validación de campos obligatorios
        if (!id_usuario || !id_habitacion || !fecha_entrada || !fecha_salida || !costo_total) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios' 
            });
        }

        const datosReservacion = { 
            id_usuario: Number(id_usuario), 
            id_habitacion: Number(id_habitacion), 
            fecha_entrada, 
            fecha_salida, 
            costo_total: Number(costo_total), 
            estado_reserva 
        };

        ReservacionDAO.agregar(datosReservacion, (err, idGenerado) => {
            if (err) {
                console.error('Error al crear reservación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al registrar' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Reservación registrada correctamente',
                id: idGenerado
            });
        });
    }

    static eliminarReservacion(req, res) {
        const id = req.params.id;

        ReservacionDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar reservación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al eliminar' });
            }
            
            res.json({ success: true, mensaje: 'Reservación eliminada correctamente' });
        });
    }

    static obtenerReservacion(req, res) {
        const id = req.params.id;

        ReservacionDAO.obtenerPorId(id, (err, reservacion) => {
            if (err) {
                console.error('Error al obtener reservación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            if (reservacion) return res.json({ success: true, reservacion: reservacion });
            
            return res.status(404).json({ success: false, mensaje: 'Reservación no encontrada' });
        });
    }

    static actualizarReservacion(req, res) {
        const id = req.params.id;
        const { id_usuario, id_habitacion, fecha_entrada, fecha_salida, costo_total, estado_reserva } = req.body;

        // Validación de campos obligatorios
        if (!id_usuario || !id_habitacion || !fecha_entrada || !fecha_salida || !costo_total) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        const datosReservacion = { 
            id_usuario: Number(id_usuario), 
            id_habitacion: Number(id_habitacion), 
            fecha_entrada, 
            fecha_salida, 
            costo_total: Number(costo_total), 
            estado_reserva 
        };

        ReservacionDAO.actualizar(id, datosReservacion, (err, result) => {
            if (err) {
                console.error('Error al actualizar reservación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Reservación actualizada correctamente' });
        });
    }
}

module.exports = ControllerReservacion;