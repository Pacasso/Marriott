const express = require('express');
const cors = require('cors');
const multer = require('multer'); //Para la recepción de archivos
const path = require('path');

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static('View')); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'View/img/'); // Aquí se guardarán físicamente las imagenes (como costo xD)
    },
    filename: function (req, file, cb) {
        // Le agregamos la fecha al nombre para que nunca haya imágenes duplicadas
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const ControllerUsuario = require('./Controller/ControllerUsuario');
const ControllerDestino = require('./Controller/ControllerDestino');
const ControllerEstado = require('./Controller/ControllerEstado');
const ControllerHotel = require('./Controller/ControllerHotel');
const ControllerServicio = require('./Controller/ControllerServicio');
const ControllerHabitacion = require('./Controller/ControllerHabitacion');
const ControllerReservacion = require('./Controller/ControllerReservacion');
const db = require('./Model/db');
// Rutas para la API de Usuarios
app.post('/api/login', ControllerUsuario.iniciarSesion);
app.get('/api/usuarios', ControllerUsuario.listarUsuarios);
app.post('/api/usuarios', ControllerUsuario.crearUsuario);
app.get('/api/usuarios/:id', ControllerUsuario.obtenerUsuario);
app.put('/api/usuarios/:id', ControllerUsuario.actualizarUsuario);
app.delete('/api/usuarios/:id', ControllerUsuario.eliminarUsuario);
// Rutas para la API de Roles
app.get('/api/roles', (req, res) => {
    db.query('SELECT * FROM Rol', (err, results) => {
        if (err) {
            console.error('Error al obtener roles:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al obtener roles' });
        }
        res.json({ success: true, roles: results });
    });
});
// Rutas para la API de Destinos
app.get('/api/destinos', ControllerDestino.listarDestinos);
app.post('/api/destinos', upload.single('imagen'), ControllerDestino.crearDestino);
app.delete('/api/destinos/:id', ControllerDestino.eliminarDestino);
app.get('/api/destinos/:id', ControllerDestino.obtenerDestino);
app.put('/api/destinos/:id', upload.single('imagen'), ControllerDestino.actualizarDestino);
// Rutas para la API de Estados
app.get('/api/estados', ControllerEstado.listarEstados);
// Rutas para la API de Hoteles
app.get('/api/hoteles', ControllerHotel.listarHoteles);
app.post('/api/hoteles', upload.single('imagen'), ControllerHotel.crearHotel);
app.delete('/api/hoteles/:id', ControllerHotel.eliminarHotel);
app.get('/api/hoteles/:id', ControllerHotel.obtenerHotel);
app.put('/api/hoteles/:id', upload.single('imagen'), ControllerHotel.actualizarHotel);
// Rutas para la API de Servicios
app.get('/api/servicios', ControllerServicio.listarServicios);
app.post('/api/servicios', ControllerServicio.crearServicio);
app.delete('/api/servicios/:id', ControllerServicio.eliminarServicio);
app.get('/api/servicios/:id', ControllerServicio.obtenerServicio);
app.put('/api/servicios/:id', ControllerServicio.actualizarServicio);
// Rutas para la API de Habitaciones
app.get('/api/habitaciones', ControllerHabitacion.listarHabitaciones);
app.post('/api/habitaciones', ControllerHabitacion.crearHabitacion);
app.delete('/api/habitaciones/:id', ControllerHabitacion.eliminarHabitacion);
app.get('/api/habitaciones/:id', ControllerHabitacion.obtenerHabitacion);
app.put('/api/habitaciones/:id', ControllerHabitacion.actualizarHabitacion);
// Rutas para la API de Reservaciones
app.get('/api/reservaciones', ControllerReservacion.listarReservaciones);
app.post('/api/reservaciones', ControllerReservacion.crearReservacion);
app.delete('/api/reservaciones/:id', ControllerReservacion.eliminarReservacion);
app.get('/api/reservaciones/:id', ControllerReservacion.obtenerReservacion);
app.put('/api/reservaciones/:id', ControllerReservacion.actualizarReservacion);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor MVC corriendo en http://localhost:${PORT}`);
});