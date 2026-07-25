const HabitacionDAO = require('../Model/HabitacionDAO');

class ControllerHabitacion {

    static listarHabitaciones(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            HabitacionDAO.buscar(criterio, (err, habitaciones) => {
                if (err) {
                    console.error('Error al buscar habitaciones:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                
                if (habitaciones.length === 0) {
                    return res.json({ success: true, habitaciones: [], mensaje: 'No se encontraron habitaciones que coincidan con la búsqueda' });
                }
                res.json({ success: true, habitaciones: habitaciones });
            });
        } else {
            HabitacionDAO.obtenerTodos((err, habitaciones) => {
                if (err) {
                    console.error('Error al obtener habitaciones:', err);
                    return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                }
                res.json({ success: true, habitaciones: habitaciones });
            });
        }
    }

    static crearHabitacion(req, res) {
        const { id_hotel, numero, categoria, capacidad, tarifa, estatus } = req.body;

        // Flujo Alterno: Validación de campos obligatorios
        if (!id_hotel || !numero || !categoria || !capacidad || !tarifa) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios' 
            });
        }

        const datosHabitacion = { 
            id_hotel: Number(id_hotel), 
            numero, 
            categoria, 
            capacidad: Number(capacidad), 
            tarifa: Number(tarifa), 
            estatus 
        };

        HabitacionDAO.agregar(datosHabitacion, (err, idGenerado) => {
            if (err) {
                console.error('Error al crear habitación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al registrar' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Habitación registrada correctamente',
                id: idGenerado
            });
        });
    }

    static eliminarHabitacion(req, res) {
        const id = req.params.id;

        HabitacionDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar habitación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al eliminar' });
            }
            
            res.json({ success: true, mensaje: 'Habitación eliminada correctamente' });
        });
    }

    static obtenerHabitacion(req, res) {
        const id = req.params.id;

        HabitacionDAO.obtenerPorId(id, (err, habitacion) => {
            if (err) {
                console.error('Error al obtener habitación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            if (habitacion) return res.json({ success: true, habitacion: habitacion });
            
            return res.status(404).json({ success: false, mensaje: 'Habitación no encontrada' });
        });
    }

    static actualizarHabitacion(req, res) {
        const id = req.params.id;
        const { id_hotel, numero, categoria, capacidad, tarifa, estatus } = req.body;

        // Validación de campos obligatorios
        if (!id_hotel || !numero || !categoria || !capacidad || !tarifa) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        const datosHabitacion = { 
            id_hotel: Number(id_hotel), 
            numero, 
            categoria, 
            capacidad: Number(capacidad), 
            tarifa: Number(tarifa), 
            estatus 
        };

        HabitacionDAO.actualizar(id, datosHabitacion, (err, result) => {
            if (err) {
                console.error('Error al actualizar habitación:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Habitación actualizada correctamente' });
        });
    }
}

module.exports = ControllerHabitacion;