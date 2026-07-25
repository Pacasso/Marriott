const HotelDAO = require('../Model/HotelDAO');

class ControllerHotel {

    static listarHoteles(req, res) {
        const criterio = req.query.q;

        if (criterio) {
            HotelDAO.buscar(criterio, (err, hoteles) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                
                if (hoteles.length === 0) {
                    return res.json({ success: true, hoteles: [], mensaje: 'No se encontraron hoteles que coincidan con la búsqueda' });
                }
                res.json({ success: true, hoteles: hoteles });
            });
        } else {
            HotelDAO.obtenerTodos((err, hoteles) => {
                if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
                res.json({ success: true, hoteles: hoteles });
            });
        }
    }

    static crearHotel(req, res) {
        const { nombre, id_destino, habitaciones, categoria, tarifa, promociones, estatus_activo } = req.body;
        const imagen = req.file ? req.file.filename : '';
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;
        
        let serviciosTexto = '';
        if (req.body.servicios) {
            serviciosTexto = Array.isArray(req.body.servicios) ? req.body.servicios.join(',') : req.body.servicios;
        }

        // Validación de campos obligatorios
        if (!nombre || !id_destino || !habitaciones || !categoria || !tarifa || !imagen) {
            return res.status(400).json({ 
                success: false, 
                mensaje: 'Por favor, complete todos los campos obligatorios, incluyendo la imagen' 
            });
        }

        const datosHotel = { 
            nombre, 
            id_destino, 
            habitaciones, 
            categoria, 
            tarifa, 
            servicios: serviciosTexto, 
            promociones, 
            imagen, 
            estatus_activo: estatusActivo 
        };

        HotelDAO.agregar(datosHotel, (err, idGenerado) => {
            if (err) {
                console.error('Error al crear hotel:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor al registrar' });
            }
            
            res.json({ 
                success: true, 
                mensaje: 'Hotel registrado correctamente',
                id: idGenerado
            });
        });
    }

    static eliminarHotel(req, res) {
        const id = req.params.id;

        HotelDAO.eliminar(id, (err, result) => {
            if (err) {
                console.error('Error al eliminar hotel:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            
            res.json({ success: true, mensaje: 'Hotel eliminado correctamente' });
        });
    }

    static obtenerHotel(req, res) {
        const id = req.params.id;

        HotelDAO.obtenerPorId(id, (err, hotel) => {
            if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            if (hotel) return res.json({ success: true, hotel: hotel });
            
            return res.status(404).json({ success: false, mensaje: 'Hotel no encontrado' });
        });
    }

    static actualizarHotel(req, res) {
        const id = req.params.id;
        const { nombre, id_destino, habitaciones, categoria, tarifa, promociones, estatus_activo } = req.body;
        const imagen = req.file ? req.file.filename : (req.body.imagenActual || '');
        const estatusActivo = estatus_activo !== undefined ? Number(estatus_activo) : 1;

        let serviciosTexto = '';
        if (req.body.servicios) {
            serviciosTexto = Array.isArray(req.body.servicios) ? req.body.servicios.join(',') : req.body.servicios;
        }

        if (!nombre || !id_destino || !habitaciones || !categoria || !tarifa) {
            return res.status(400).json({ success: false, mensaje: 'Por favor, complete todos los campos obligatorios' });
        }

        const datosHotel = { 
            nombre, 
            id_destino, 
            habitaciones, 
            categoria, 
            tarifa, 
            servicios: serviciosTexto, 
            promociones, 
            imagen, 
            estatus_activo: estatusActivo 
        };

        HotelDAO.actualizar(id, datosHotel, (err, result) => {
            if (err) {
                console.error('Error al actualizar hotel:', err);
                return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            }
            res.json({ success: true, mensaje: 'Hotel actualizado correctamente' });
        });
    }
}

module.exports = ControllerHotel;