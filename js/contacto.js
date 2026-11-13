// =============================================================
// EcoEnergetic: el formulario de contacto
// Este archivo solo lo carga contacto.html (con <script ... defer>)
//
// Que hace: cuando se envia el formulario, muestra un mensaje de
// agradecimiento con el nombre de la persona y limpia los campos.
// El sitio no tiene servidor: el mensaje no se envia a ninguna parte.
// =============================================================
// DOM: document.querySelector busca en la pagina el elemento con ese id.
// const: estas dos constantes siempre apuntan al mismo elemento
// El formulario <form id="form-contacto">
const formulario = document.querySelector("#form-contacto");
// El parrafo <p id="respuesta">, que empieza oculto
const respuesta = document.querySelector("#respuesta");
// EVENTO "submit": ocurre al oprimir "Enviar mensaje", solo si los campos
// obligatorios (required) estan llenos y el correo esta bien escrito.
// addEventListener("submit", funcion) = cuando ocurra, ejecuta esta funcion.
// evento = la informacion de lo que paso
formulario.addEventListener("submit", function (evento) {
// Por defecto, al enviar un formulario la pagina se recarga.
// preventDefault lo evita: asi se alcanza a ver el mensaje
evento.preventDefault();
// Lee lo que se escribio en el campo <input id="nombre">.
// .value = el texto que tiene escrito un campo
const nombre = document.querySelector("#nombre").value;
// Escribe el mensaje dentro del parrafo, con un TEMPLATE STRING:
// texto entre comillas invertidas, donde ${nombre} se cambia por el nombre.
// textContent = el texto que se ve dentro del elemento
respuesta.textContent = `¡Gracias, ${nombre}! Recibimos su mensaje y le responderemos pronto.`;
// classList = las clases del elemento. d-none es la clase de Bootstrap
// que oculta. Al quitarla, el mensaje aparece

respuesta.classList.remove("d-none");
// reset deja todos los campos del formulario en blanco
formulario.reset();
});