const db = require('./db');

class EstadoDAO {
    static obtenerTodos(callback) {
        const query = 'SELECT * FROM Estado ORDER BY nombre ASC';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    }
}
module.exports = EstadoDAO;