const EstadoDAO = require('../Model/EstadoDAO');

class ControllerEstado {
    static listarEstados(req, res) {
        EstadoDAO.obtenerTodos((err, estados) => {
            if (err) return res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
            res.json({ success: true, estados: estados });
        });
    }
}
module.exports = ControllerEstado;