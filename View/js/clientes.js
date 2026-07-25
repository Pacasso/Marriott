function toggleMenu() {

    document.getElementById("sidebar")
        .classList.toggle("oculto");

    document.getElementById("main")
        .classList.toggle("expandido");

}

function togglePerfil(){

    document
        .getElementById("perfilDropdown")
        .classList.toggle("activo");

}