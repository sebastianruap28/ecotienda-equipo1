// =============================================================
// EcoEnergetic: el catalogo, los filtros, el buscador y el carrito
// Este archivo solo lo carga catalogo.html (con <script ... defer>)
//
// Como esta organizado:
// 1. Constantes y el arreglo de productos (los DATOS)
// 2. Variables que cambian (el carrito, el filtro, la busqueda)
// 3. Funciones de calculo y de texto
// 4. Funciones que escriben en la pagina (el DOM)
// 5. Eventos (clic y escribir)

// 6. Lo que se ejecuta al cargar la pagina
// =============================================================
// -------------------------------------------------------------
// 1. CONSTANTES: valores que no cambian. Se declaran con const
// -------------------------------------------------------------
// Se escriben en MAYUSCULAS para que se note que son fijas
const TARIFA = 950; // lo que cuesta 1 kWh, en pesos (COP). Es una tarifa de ejemplo
const DIAS_MES = 30; // dias de un mes: para pasar el ahorro de un dia al de un mes
// --- ARREGLO DE OBJETOS LITERALES: la lista de productos ---
// [ ] = un ARREGLO: una lista de elementos, separados por comas
// { } = un OBJETO LITERAL: un grupo de datos con nombre (propiedad: valor)
// Cada producto es un objeto. Sus datos se leen con un punto: producto.precio
// id = un numero unico, para saber cual producto se agrega al carrito
// nombre = el nombre que se muestra
// categoria = sin tildes ni mayusculas, para compararla con los filtros
// precio = en pesos
// wattsAntes = potencia del equipo VIEJO que se reemplaza (en vatios, W)
// wattsDespues = potencia del equipo NUEVO (0 si no gasta energia de la red)
// horasDia = cuantas horas al dia se usa
// Son 10 productos de 4 categorias: iluminacion, climatizacion, cocina y solar
const productos = [
    {
        id: 1, nombre: "Bombillo LED 12 W", categoria: "iluminacion", precio: 9500,
        wattsAntes: 100, wattsDespues: 12, horasDia: 5
    },
    {
        id: 2, nombre: "Tubo LED T8 18 W", categoria: "iluminacion", precio: 18900,
        wattsAntes: 40, wattsDespues: 18, horasDia: 8
    },
    {
        id: 3, nombre: "Lámpara LED con sensor de movimiento", categoria: "iluminacion", precio: 42000,
        wattsAntes: 60, wattsDespues: 10, horasDia: 6
    },
    {
        id: 4, nombre: "Ventilador de techo con motor DC", categoria: "climatizacion", precio: 389000,
        wattsAntes: 75, wattsDespues: 35, horasDia: 8
    },
    {
        id: 5, nombre: "Aire acondicionado inverter 12.000 BTU", categoria: "climatizacion", precio: 1950000,
        wattsAntes: 1500, wattsDespues: 950, horasDia: 6
    },
    {
        id: 6, nombre: "Nevera inverter 300 L", categoria: "cocina", precio: 2150000,
        wattsAntes: 90, wattsDespues: 45, horasDia: 24
    },
    {
        id: 7, nombre: "Estufa de inducción de un puesto", categoria: "cocina", precio: 219000,
        wattsAntes: 1500, wattsDespues: 1100, horasDia: 2
    },
    {
        id: 8, nombre: "Olla a presión eléctrica 6 L", categoria: "cocina", precio: 289000,
        wattsAntes: 1200, wattsDespues: 700, horasDia: 1
    },
    {
        id: 9, nombre: "Calentador solar de agua 150 L", categoria: "solar", precio: 1350000,
        wattsAntes: 3500, wattsDespues: 0, horasDia: 0.5
    },
    {
        id: 10, nombre: "Kit de panel solar 600 W", categoria: "solar", precio: 2650000,
        wattsAntes: 600, wattsDespues: 0, horasDia: 4.5
    }
];
// -------------------------------------------------------------
// 2. VARIABLES que SI cambian. Se declaran con let (var no se usa)
// -------------------------------------------------------------

// El carrito: un arreglo que empieza vacio; se le agregan productos con push
let carrito = [];
// El filtro elegido: "todas" o el nombre de una categoria. Cambia al oprimir un boton
let categoriaActual = "todas";
// Lo que se escribio en el buscador. "" = nada escrito. Cambia al escribir
let textoBuscado = "";
// -------------------------------------------------------------
// 3. FUNCIONES de calculo y de texto
// -------------------------------------------------------------
// Una funcion es un bloque de codigo con nombre.
// Recibe datos (PARAMETROS, entre parentesis) y devuelve un resultado con return.
// Se escribe una vez y se usa muchas veces: ahorroKwhMes(producto)
// ahorroKwhMes: cuantos kWh ahorra un producto en un mes.
// Recibe un producto (uno de los objetos del arreglo).
// Ejemplo con el bombillo: (100 - 12) x 5 x 30 / 1000 = 13.2 kWh
function ahorroKwhMes(producto) {
    // producto.wattsAntes - producto.wattsDespues = los vatios que se dejan de gastar (100 - 12 = 88 W)
    // * producto.horasDia = por las horas de uso al dia (88 x 5 = 440 Wh al dia)
    // * DIAS_MES = por los 30 dias del mes (440 x 30 = 13200 Wh al mes)
    // / 1000 = de Wh a kWh, que es como cobra la empresa de energia (13.2 kWh)
    // return devuelve ese numero a quien llamo la funcion
    return (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
}
// ahorroPesosMes: cuantos pesos ahorra un producto en un mes.
// Ejemplo con el bombillo: 13.2 kWh x 950 = 12540 pesos
function ahorroPesosMes(producto) {
    // Llama la funcion anterior para saber los kWh (13.2)
    // y los multiplica por lo que cuesta cada kWh (TARIFA = 950)
    return ahorroKwhMes(producto) * TARIFA;
}
// pesos: escribe un numero como plata colombiana.
// Ejemplos: pesos(9500) -> "$9.500" pesos(12540.4) -> "$12.540"
function pesos(valor) {
    // Math.round(valor) = redondea sin decimales: 12540.4 -> 12540
    // .toLocaleString("es-CO") = lo escribe como en Colombia, con punto de miles: "12.540"
    // "$" + = le pega el signo de pesos adelante: "$12.540"
    return "$" + Math.round(valor).toLocaleString("es-CO");
}
// nombreCategoria: el nombre de la categoria para mostrar, con tilde y mayuscula.
// En los datos se guarda sin tildes ("iluminacion") y en la pagina se muestra "Iluminación"
function nombreCategoria(categoria) {
    // CONDICIONAL: if = "si"; else if = "si no, si"; else = "si no"
    // === compara si son EXACTAMENTE iguales

    if (categoria === "iluminacion") {
        // Devuelve el nombre y la funcion termina aqui
        return "Iluminación";
    } else if (categoria === "climatizacion") {
        return "Climatización";
    } else if (categoria === "cocina") {
        return "Cocina";
    } else {
        // Si no es ninguna de las tres anteriores, solo queda "solar"
        return "Energía solar";
    }
}
// mesesRetorno: en cuantos meses el ahorro paga lo que costo la compra.
// Recibe DOS parametros: el precio y el ahorro de cada mes.
// Ejemplo: mesesRetorno(1359500, 62415) -> 1359500 / 62415 = 21.78 -> 22 meses
function mesesRetorno(precio, ahorroMes) {
    // Math.ceil redondea HACIA ARRIBA: 21.78 -> 22 (con 21 meses todavia no alcanza)
    return Math.ceil(precio / ahorroMes);
}
// textoReemplazo: la frase que explica que equipo se reemplaza.
// Si el equipo nuevo gasta 0 W (los de energia solar), la frase es distinta
function textoReemplazo(producto) {
    // CONDICIONAL: el equipo nuevo no gasta energia de la red?
    if (producto.wattsDespues === 0) {
        // TEMPLATE STRING: texto entre comillas invertidas ` `; ${ } mete un valor
        return `Reemplaza un equipo de ${producto.wattsAntes} W, usado ${producto.horasDia} h al día, y no gasta
energía de la red.`;
    } else {
        return `Reemplaza un equipo de ${producto.wattsAntes} W por uno de ${producto.wattsDespues} W, usado
${producto.horasDia} h al día.`;
    }
}
// sinTildes: pasa un texto a minusculas y le quita las tildes,
// para que buscar "lampara" o "LAMPARA" encuentre "Lámpara".
// Ejemplo: sinTildes("Lámpara LED") -> "lampara led"
function sinTildes(texto) {
    // .toLowerCase() = todo a minusculas: "Lámpara" -> "lámpara"
    // .normalize("NFD") = separa cada letra de su tilde: "á" -> "a" + " ́"
    // .replace(/[̀-ͯ]/g, "") = borra todas las tildes sueltas
    // (̀-ͯ son los codigos de las tildes; g = todas, no solo la primera)
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// -------------------------------------------------------------
// 4. DOM: funciones que escriben en la pagina
// -------------------------------------------------------------
// DOM = la pagina vista desde JavaScript: cada etiqueta del HTML es un objeto
// que JavaScript puede buscar, leer y cambiar
// mostrarProductos: escribe en la pagina una tarjeta por cada producto que
// pase el filtro (categoriaActual) y el buscador (textoBuscado).
// Se llama al cargar la pagina, al oprimir un filtro y al escribir en el buscador
function mostrarProductos() {
    // document.querySelector("#productos") busca el elemento con id="productos"
    // (el <div id="productos"> vacio de catalogo.html) y lo guarda en contenedor
    const contenedor = document.querySelector("#productos");
    // innerHTML = el HTML que hay dentro del elemento. "" = nada: lo vacia,
    // para no repetir tarjetas cada vez que la funcion se llama
    contenedor.innerHTML = "";
    // CONTADOR: cuantas tarjetas se escribieron. let, porque va cambiando
    let mostrados = 0;
    // BUCLE for...of: repite el bloque { } una vez por cada elemento del arreglo.
    // En cada vuelta, producto es un producto distinto: 1.a vuelta el bombillo, 2.a el tubo...
    for (const producto of productos) {
        // CONDICIONAL 1 (el FILTRO): si se eligio una categoria (no "todas")
        // Y el producto es de OTRA categoria...
        // !== significa "distinto de"; && significa "y" (las dos cosas deben cumplirse)
        if (categoriaActual !== "todas" && producto.categoria !== categoriaActual) {
            // ...continue salta a la siguiente vuelta del bucle: este producto no se muestra
            continue;

        }
        // CONDICIONAL 2 (el BUSCADOR): si el nombre NO contiene lo que se escribio...
        // .includes(texto) dice si un texto contiene a otro (true o false)
        // ! adelante significa "no"
        // Los dos textos pasan por sinTildes para compararlos sin tildes ni mayusculas.
        // Si no se ha escrito nada (""), todos los nombres lo contienen: se muestran todos
        if (!sinTildes(producto.nombre).includes(sinTildes(textoBuscado))) {
            // ...tampoco se muestra
            continue;
        }
        // Si llego hasta aqui, el producto se muestra.
        // += agrega al final de lo que ya habia (sin += se borrarian las tarjetas anteriores).
        // El texto va entre comillas invertidas ` ` (TEMPLATE STRING): permite varias
        // lineas y meter valores con ${ }. Lo que se mete en cada ${ }:
        // nombreCategoria(producto.categoria) -> "Iluminación"
        // producto.nombre -> "Bombillo LED 12 W"
        // textoReemplazo(producto) -> "Reemplaza un equipo de 100 W por uno de 12 W..."
        // pesos(producto.precio) -> "$9.500"
        // ahorroKwhMes(producto).toFixed(1) -> "13.2" (toFixed(1) = con 1 decimal)
        // pesos(ahorroPesosMes(producto)) -> "$12.540"
        // producto.id (en data-id del boton) -> 1: asi el boton sabe de que producto es
        contenedor.innerHTML += `
<article class="tarjeta">
<span class="categoria">${nombreCategoria(producto.categoria)}</span>
<h3>${producto.nombre}</h3>
<p>${textoReemplazo(producto)}</p>
<p class="precio">${pesos(producto.precio)}</p>
<p>Ahorra <span class="ahorro">${ahorroKwhMes(producto).toFixed(1)} kWh</span>
(<span class="ahorro">${pesos(ahorroPesosMes(producto))}</span>) al mes.</p>
<button type="button" class="btn btn-primary btn-sm" data-id="${producto.id}">Agregar al

carrito</button>
</article>`;
        // Suma 1 al contador de tarjetas. += 1 es lo mismo que mostrados = mostrados + 1
        mostrados += 1;
    }
    // Si el contador quedo en 0, ningun producto paso el filtro y el buscador:
    // en vez de dejar la pagina vacia, se escribe un mensaje
    if (mostrados === 0) {
        contenedor.innerHTML = `<p class="sin-resultados">No hay productos que coincidan con la búsqueda.</p>`;
    }
}
// agregarAlCarrito: agrega al carrito el producto que tiene ese id.
// Ejemplo: agregarAlCarrito(1) agrega el bombillo
function agregarAlCarrito(id) {

    // Recorre todos los productos, uno por uno...
    for (const producto of productos) {
        // ...y cuando encuentra el que tiene ese id (=== compara: 1 === 1)...
        if (producto.id === id) {
            // ...lo agrega al final del arreglo carrito. push = "empujar al final"
            carrito.push(producto);
        }
    }
    // Vuelve a dibujar el carrito, ya con el producto nuevo
    mostrarCarrito();
}
// mostrarCarrito: dibuja el carrito: la cantidad, la lista, el total,
// el ahorro al mes y en cuantos meses se paga sola la compra.
// Se llama cada vez que el carrito cambia (al agregar o al vaciar)
function mostrarCarrito() {
    // Busca la lista <ul id="lista-carrito"> del carrito
    const lista = document.querySelector("#lista-carrito");
    // La vacia, para escribirla de nuevo completa (si no, los productos se repetirian)
    lista.innerHTML = "";
    // ACUMULADORES: variables que empiezan en 0 y van sumando en el bucle.
    // let, porque su valor cambia en cada vuelta
    let total = 0; // la suma de los precios
    let ahorroMes = 0; // la suma de lo que ahorra cada producto al mes
    // BUCLE: recorre los productos que hay en el carrito
    for (const producto of carrito) {
        // Agrega a la lista una linea <li> con el nombre y el precio.
        // Ejemplo: <li>Bombillo LED 12 W: $9.500</li>
        lista.innerHTML += `<li>${producto.nombre}: ${pesos(producto.precio)}</li>`;
        // Suma el precio al total. Ejemplo: 0 + 9500 = 9500; luego 9500 + 1350000 = 1359500
        total += producto.precio;
        // Suma lo que ahorra este producto al mes
        ahorroMes += ahorroPesosMes(producto);
    }
    // .length = cuantos elementos tiene el arreglo: cuantos productos hay en el carrito.
    // textContent = el texto que se ve dentro del elemento.
    // Lo escribe en el <span id="cantidad"> del titulo: "Carrito (2)"
    document.querySelector("#cantidad").textContent = carrito.length;
    // Escribe el total en el parrafo <p id="total">. Ejemplo: "Total: $1.359.500"
    document.querySelector("#total").textContent = "Total: " + pesos(total);
    // CONDICIONAL: el carrito esta vacio?
    if (carrito.length === 0) {
        // Si: un mensaje en el parrafo <p id="ahorro">
        document.querySelector("#ahorro").textContent = "El carrito está vacío.";
    } else {

        // No: calcula en cuantos meses el ahorro paga la compra (funcion mesesRetorno)
        const meses = mesesRetorno(total, ahorroMes);
        // Y escribe el ahorro y los meses, con un template string.
        // Ejemplo: "Ahorra $62.415 al mes: la compra se paga sola en 22 meses."
        document.querySelector("#ahorro").textContent =
            `Ahorra ${pesos(ahorroMes)} al mes: la compra se paga sola en ${meses} meses.`;
    }
}

// -------------------------------------------------------------
// 5. EVENTOS: el programa reacciona a lo que hace el usuario
// -------------------------------------------------------------
// Un evento es algo que hace el usuario (un clic, escribir).
// elemento.addEventListener("evento", funcion) = cuando ocurra ese evento
// en ese elemento, ejecuta esa funcion
// --- FILTROS: clic en un boton de categoria ---
// querySelectorAll busca TODOS los elementos con la clase .filtro
// (los 5 botones) y los guarda en botonesFiltro (una lista)

const botonesFiltro = document.querySelectorAll(".filtro");
// Recorre los 5 botones...
for (const boton of botonesFiltro) {
    // ...y a cada uno le pone a ESCUCHAR el evento "click"
    boton.addEventListener("click", function () {
        // Recorre otra vez los 5 botones...
        for (const otro of botonesFiltro) {
            // ...y les quita la clase "activo" a todos (classList = las clases del elemento)
            otro.classList.remove("activo");
        }
        // Le pone la clase "activo" solo al boton que se oprimio:
        // el CSS (.filtro.activo) lo resalta con fondo azul
        boton.classList.add("activo");
        // dataset.categoria lee el atributo data-categoria del boton.
        // Ejemplo: <button data-categoria="solar"> -> "solar".
        // Se guarda en la variable, para que el buscador tambien respete el filtro
        categoriaActual = boton.dataset.categoria;
        // Vuelve a dibujar los productos, ahora solo los de esa categoria
        mostrarProductos();
    });
}
// --- BUSCADOR: escribir en el campo de texto ---
// El evento "input" ocurre cada vez que cambia lo escrito (cada letra que se
// escribe o se borra), sin tener que oprimir Enter
document.querySelector("#buscar").addEventListener("input", function (evento) {
    // evento = la informacion de lo que paso.
    // evento.target = el elemento donde ocurrio: el campo <input id="buscar">
    // .value = el texto que tiene escrito el campo
    textoBuscado = evento.target.value;
    // Vuelve a dibujar los productos: solo los que contienen ese texto en el nombre
    mostrarProductos();
});
// --- AGREGAR AL CARRITO: clic en un boton "Agregar al carrito" ---
// Se escucha en el CONTENEDOR #productos y no en cada boton, porque los botones
// los crea JavaScript y se borran y se vuelven a crear cada vez que se filtra
document.querySelector("#productos").addEventListener("click", function (evento) {
    // evento.target = el elemento exacto donde se hizo clic
    // (puede ser un boton, un titulo, un precio...).
    // Si tiene data-id, es un boton "Agregar al carrito"; si no, se hizo clic en otra parte
    if (evento.target.dataset.id) {
        // dataset.id es TEXTO ("1"). Number lo convierte en numero (1),
        // para que producto.id === id funcione (1 === "1" daria false)
        agregarAlCarrito(Number(evento.target.dataset.id));
    }
});

// --- VACIAR: clic en el boton "Vaciar carrito" (<button id="vaciar">) ---
document.querySelector("#vaciar").addEventListener("click", function () {
    // El carrito vuelve a ser un arreglo vacio (por eso se declaro con let)
    carrito = [];
    // Y se vuelve a dibujar: sale "El carrito está vacío."
    mostrarCarrito();
});
// -------------------------------------------------------------
// 6. Al cargar la pagina
// -------------------------------------------------------------
// Llama las funciones apenas se abre la pagina:
// muestra todos los productos (el filtro empieza en "todas") y el carrito vacio
mostrarProductos();
mostrarCarrito();