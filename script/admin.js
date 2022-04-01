const { arrayBuffer } = require("stream/consumers");// Esta línea se ha creado sóla

document.getElementsByClassName('btCrear').addEventListener('click', pintaPelis());
function pintaPelis() {
    let sectPadre = document.getElementsByClassName('cajaPadre');
    let artHijo, peliNueva, btEditar, btEliminar;

    for (let i=0; i<array.length; i++) { //hay ke poner el array correcto
        //Creo la cajaHijo(article) para ordenarlas dentro de la cajaPadre(section), según como lo hagamos, se puede borrar
        artHijo = document.createElement('article');
        artHijo.className('cajaHijo');
        sectPadre.appendChild(artHijo);

        peliNueva = document.createElement('p');
        peliNueva.innerHTML = (array[i].titulo);
        artHijo.appendChild(peliNueva);

        btEditar = document.createElement('button');
        btEditar.id = 'ed' + array[i].titulo;   //repasar id
        btEditar.name = 'btEditar';
        btEditar.addEventListener('click', () => {
            alert("editamos peli");//falta codigo
            window.open('editmovie.pug', '_self');
        })
        artHijo.appendChild(btEditar).innerHTML = 'Editar';

        btEliminar = document.createElement('button');
        btEliminar.id = 'el' + array[i].titulo; //repasar id
        btEliminar.name = 'btEliminar';
        btEliminar.addEventListener('click', () => {
            alert("borramos peli");//falta codigo
            window.open('removemovie.pug', '_self');
        })
        artHijo.appendChild(btEliminar).innerHTML = 'Eliminar';
    }
}
//array.forEach(pintaPelis);

