class Usuario {
    constructor(id_usuario, id_rol, nombre_completo, correo_electronico, contrasena, estatus, nombre_rol = '') {
        this.id_usuario = id_usuario;
        this.id_rol = id_rol;
        this.nombre_completo = nombre_completo;
        this.correo_electronico = correo_electronico;
        this.contrasena = contrasena;
        this.estatus = estatus;
        this.nombre_rol = nombre_rol;
    }

    getIdUsuario() { return this.id_usuario; }
    getIdRol() { return this.id_rol; }
    getNombreCompleto() { return this.nombre_completo; }
    getCorreoElectronico() { return this.correo_electronico; }
    getContrasena() { return this.contrasena; }
    getEstatus() { return this.estatus; }
    getNombreRol() { return this.nombre_rol; }

    setIdUsuario(id_usuario) { this.id_usuario = id_usuario; }
    setIdRol(id_rol) { this.id_rol = id_rol; }
    setNombreCompleto(nombre_completo) { this.nombre_completo = nombre_completo; }
    setCorreoElectronico(correo_electronico) { this.correo_electronico = correo_electronico; }
    setContrasena(contrasena) { this.contrasena = contrasena; }
    setEstatus(estatus) { this.estatus = estatus; }
    setNombreRol(nombre_rol) { this.nombre_rol = nombre_rol; }
}

module.exports = Usuario;