
/**
 * Arreglo principal que almacena todos los equipos registrados.
 * Cada equipo es un objeto con las propiedades del formulario.
 * Nota: Los datos se pierden al recargar la página (sin persistencia).
 */
let equipos = [];

/**
 * Variable que controla si estamos editando un equipo existente.
 * Contiene el índice del equipo en el arreglo o null si es uno nuevo.
 */
let editandoIndex = null;

// 
// REFERENCIAS A ELEMENTOS DEL DOM
// 

/**
 * Obtenemos las referencias a todos los elementos HTML con los que
 * interactuaremos desde JavaScript. Esto se ejecuta una sola vez
 * al cargar la página para optimizar el rendimiento.
 */

// Formulario y sus campos
const formulario = document.getElementById('equipo-form');         // Formulario principal
const inputTipo = document.getElementById('tipo');                 // Select de tipo de computadora
const inputTitular = document.getElementById('titular');           // Input del nombre del titular
const inputMarca = document.getElementById('marca');               // Input de la marca
const inputProcesador = document.getElementById('procesador');     // Input del procesador
const inputRam = document.getElementById('ram');                   // Input de la memoria RAM
const inputAlmacenamiento = document.getElementById('almacenamiento'); // Input del almacenamiento
const inputVideo = document.getElementById('video');               // Input de la placa de video
const inputPulgadas = document.getElementById('pulgadas');         // Input de las pulgadas

// Botones
const btnGuardar = document.getElementById('btn-guardar');         // Botón para guardar/editar
const btnCancelar = document.getElementById('btn-cancelar');       // Botón para cancelar edición

// Búsqueda y filtros
const inputBuscador = document.getElementById('buscador');         // Campo de búsqueda de texto
const selectFiltroTipo = document.getElementById('filtro-tipo');   // Filtro por tipo de equipo

// Tabla y elementos relacionados
const cuerpoTabla = document.getElementById('cuerpo-tabla');       // Cuerpo de la tabla (tbody)
const contadorEquipos = document.getElementById('contador');       // Span que muestra la cantidad
const sinEquipos = document.getElementById('sin-equipos');         // Mensaje cuando no hay equipos
const formTitle = document.getElementById('form-title');           // Título del formulario

// 
// FUNCIONES DE RENDERIZADO (MOSTRAR DATOS)
// 

/**
 * Función: renderizarTabla
 * Descripción: Actualiza la tabla HTML con todos los equipos del arreglo.
 * Recorre el array 'equipos' y genera las filas dinámicamente.
 * También actualiza el contador y el mensaje de "sin equipos".
 * 
 * Parámetros: Ninguno
 * Retorna: Nada (modifica el DOM directamente)
 */
function renderizarTabla() {
    // Limpiamos el contenido actual de la tabla
    cuerpoTabla.innerHTML = '';

    // Verificamos si hay equipos para mostrar
    if (equipos.length === 0) {
        // Si no hay equipos, mostramos el mensaje informativo
        sinEquipos.style.display = 'block';
    } else {
        // Si hay equipos, ocultamos el mensaje
        sinEquipos.style.display = 'none';

        // Recorremos cada equipo del arreglo usando forEach
        // El parámetro 'equipo' representa cada objeto equipo
        // El parámetro 'index' es la posición en el arreglo (para editar/eliminar)
        equipos.forEach((equipo, index) => {
            // Creamos un nuevo elemento <tr> (fila de tabla)
            const fila = document.createElement('tr');

            // Insertamos las celdas con los datos del equipo
            // Cada celda <td> muestra un dato específico
            fila.innerHTML = `
                <td>${equipo.tipo}</td>
                <td>${equipo.titular}</td>
                <td>${equipo.marca}</td>
                <td>${equipo.procesador}</td>
                <td>${equipo.ram}</td>
                <td>${equipo.almacenamiento}</td>
                <td>${equipo.video}</td>
                <td>${equipo.pulgadas}</td>
                <td class="acciones">
                    <button class="btn btn-edit" onclick="editarEquipo(${index})">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEquipo(${index})">Eliminar</button>
                </td>
            `;

            // Agregamos la fila al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
    }

    // Actualizamos el contador de equipos registrados
    contadorEquipos.textContent = equipos.length;
}

// 
// FUNCIONES CRUD - CREAR (GUARDAR)
// 

/**
 * Función: guardarEquipo
 * Descripción: Toma los datos del formulario y los guarda en el arreglo.
 * Si se está editando, actualiza el equipo existente.
 * Si es nuevo, lo agrega al final del arreglo.
 * 
 * Parámetros: Ninguno (lee los valores directamente del DOM)
 * Retorna: Nada
 */
function guardarEquipo() {
    // Verificamos que todos los campos obligatorios estén completos
    // Si alguno está vacío, mostramos una alerta y salimos de la función
    if (!inputTipo.value || !inputTitular.value || !inputMarca.value ||
        !inputProcesador.value || !inputRam.value || !inputAlmacenamiento.value ||
        !inputVideo.value || !inputPulgadas.value) {
        alert('Por favor, complete todos los campos obligatorios.');
        return; // Salimos de la función si hay campos vacíos
    }

    // Creamos un objeto con los datos del formulario
    // Este objeto representa un equipo con todas sus propiedades
    const nuevoEquipo = {
        tipo: inputTipo.value,                       // Tipo de computadora
        titular: inputTitular.value.trim(),           // Nombre del titular (sin espacios extras)
        marca: inputMarca.value.trim(),               // Marca del equipo
        procesador: inputProcesador.value.trim(),     // Modelo del procesador
        ram: inputRam.value.trim(),                   // Cantidad y tipo de RAM
        almacenamiento: inputAlmacenamiento.value.trim(),  // Capacidad del disco
        video: inputVideo.value.trim(),              // Placa de video
        pulgadas: inputPulgadas.value.trim()         // Tamaño de pantalla
    };

    // Verificamos si estamos en modo edición o creando uno nuevo
    if (editandoIndex !== null) {
        // MODO EDICIÓN: Actualizamos el equipo en la posición indicada
        // El operador spread (...) copia todas las propiedades del nuevo objeto
        equipos[editandoIndex] = nuevoEquipo;
        
        // Mostramos mensaje de éxito
        alert('Equipo actualizado correctamente.');
        
        // Reseteamos el modo edición
        editandoIndex = null;
        
        // Restauramos el título del formulario
        formTitle.textContent = 'Registrar Nuevo Equipo';
        
        // Ocultamos el botón de cancelar edición
        btnCancelar.style.display = 'none';
        
        // Cambiamos el texto del botón guardar
        btnGuardar.textContent = 'Guardar Equipo';
    } else {
        // MODO CREACIÓN: Agregamos el nuevo equipo al final del arreglo
        // El método push() agrega un elemento al final del array
        equipos.push(nuevoEquipo);
        
        // Mostramos mensaje de éxito
        alert('Equipo guardado correctamente.');
    }

    // Limpiamos el formulario para poder ingresar otro equipo
    formulario.reset();

    // Actualizamos la tabla para mostrar el nuevo equipo
    renderizarTabla();
}


// FUNCIONES CRUD - EDITAR (ACTUALIZAR)

/**
 * Función: editarEquipo
 * Descripción: Carga los datos de un equipo en el formulario para modificarlos.
 * Cambia el formulario a modo edición y espera que el usuario haga los cambios.
 * 
 * Parámetros:
 *   - index: Posición del equipo en el arreglo 'equipos'
 * Retorna: Nada
 */
function editarEquipo(index) {
    // Obtenemos el equipo del arreglo usando su índice
    const equipo = equipos[index];

    // Cargamos cada dato del equipo en su campo correspondiente del formulario
    inputTipo.value = equipo.tipo;                  // Select de tipo
    inputTitular.value = equipo.titular;            // Input del titular
    inputMarca.value = equipo.marca;                // Input de la marca
    inputProcesador.value = equipo.procesador;      // Input del procesador
    inputRam.value = equipo.ram;                    // Input de la RAM
    inputAlmacenamiento.value = equipo.almacenamiento; // Input del almacenamiento
    inputVideo.value = equipo.video;                // Input del video
    inputPulgadas.value = equipo.pulgadas;          // Input de las pulgadas

    // Activamos el modo edición guardando el índice del equipo
    editandoIndex = index;

    // Actualizamos el título del formulario para indicar que estamos editando
    formTitle.textContent = 'Editar Equipo';

    // Mostramos el botón de cancelar edición
    btnCancelar.style.display = 'inline-block';

    // Cambiamos el texto del botón guardar para reflejar la acción
    btnGuardar.textContent = 'Actualizar Equipo';

    // Hacemos scroll al formulario para que el usuario vea dónde debe editar
    // El comportamiento 'smooth' crea una animación suave al hacer scroll
    formulario.scrollIntoView({ behavior: 'smooth' });
}


// FUNCIONES CRUD - ELIMINAR


/**
 * Función: eliminarEquipo
 * Descripción: Elimina un equipo del arreglo tras confirmación del usuario.
 * Muestra una ventana de confirmación antes de borrar permanentemente.
 * 
 * Parámetros:
 *   - index: Posición del equipo en el arreglo 'equipos'
 * Retorna: Nada
 */
function eliminarEquipo(index) {
    // Obtenemos el nombre del titular para mostrar en la confirmación
    const nombreTitular = equipos[index].titular;

    // Pedimos confirmación al usuario antes de eliminar
    // La función confirm() muestra una ventana con botones Aceptar/Cancelar
    // Retorna true si el usuario acepta, false si cancela
    const confirmar = confirm(`¿Está seguro que desea eliminar el equipo de "${nombreTitular}"?`);

    // Solo eliminamos si el usuario confirmó
    if (confirmar) {
        // El método splice() elimina elementos de un array
        // Primer parámetro: posición a partir de la cual eliminar
        // Segundo parámetro: cantidad de elementos a eliminar
        equipos.splice(index, 1);

        // Si estábamos editando este equipo, cancelamos la edición
        if (editandoIndex === index) {
            cancelarEdicion();
        }

        // Mostramos mensaje de éxito
        alert('Equipo eliminado correctamente.');

        // Actualizamos la tabla para reflejar la eliminación
        renderizarTabla();
    }
}


// FUNCIONES CRUD - BUSCAR (LEER/FILTRAR)

/**
 * Function: buscarEquipos
 * Description: Filtra los equipos según el texto de búsqueda y el tipo seleccionado.
 * La búsqueda es en tiempo real (se ejecuta cada vez que el usuario escribe).
 * Busca coincidencias parciales en titular, tipo, marca y procesador.
 * 
 * Parameters: None
 * Returns: Nothing (updates the table directly)
 */
function buscarEquipos() {
    // Obtenemos el texto de búsqueda y lo convertimos a minúsculas
    // toLowerCase() permite buscar sin importar mayúsculas/minúsculas
    const textoBusqueda = inputBuscador.value.toLowerCase().trim();
    
    // Obtenemos el tipo seleccionado en el filtro
    const tipoFiltro = selectFiltroTipo.value;

    // Aplicamos filtro al arreglo de equipos usando el método filter()
    // El método filter() crea un nuevo array con los elementos que cumplen la condición
    const equiposFiltrados = equipos.filter(equipo => {
        // Verificamos si el equipo coincide con el texto de búsqueda
        // Buscamos en titular, tipo, marca y procesador
        const coincideTexto = !textoBusqueda || 
            equipo.titular.toLowerCase().includes(textoBusqueda) ||
            equipo.tipo.toLowerCase().includes(textoBusqueda) ||
            equipo.marca.toLowerCase().includes(textoBusqueda) ||
            equipo.procesador.toLowerCase().includes(textoBusqueda);

        // Verificamos si el equipo coincide con el filtro de tipo
        const coincideTipo = !tipoFiltro || equipo.tipo === tipoFiltro;

        // El equipo debe cumplir ambas condiciones para ser mostrado
        return coincideTexto && coincideTipo;
    });

    // Renderizamos solo los equipos filtrados en la tabla
    renderizarTablaFiltrada(equiposFiltrados);
}

/**
 * Función: renderizarTablaFiltrada
 * Descripción: Muestra en la tabla únicamente los equipos filtrados.
 * 
 * Es similar a renderizarTabla() pero trabaja con un array filtrado.
 * Parámetros:
 *   - arrayFiltrado: Arreglo de equipos que coinciden con la búsqueda
 * Retorna: Nada (modifica el DOM)
 */
function renderizarTablaFiltrada(arrayFiltrado) {
    // Limpiamos el contenido actual de la tabla
    cuerpoTabla.innerHTML = '';

    // Verificamos si hay equipos filtrados para mostrar
    if (arrayFiltrado.length === 0) {
        // Si no hay resultados, mostramos el mensaje
        sinEquipos.style.display = 'block';
        sinEquipos.querySelector('p').textContent = 'No se encontraron equipos con esos criterios.';
    } else {
        // Si hay resultados, ocultamos el mensaje
        sinEquipos.style.display = 'none';

        // Recorremos cada equipo filtrado y lo agregamos a la tabla
        arrayFiltrado.forEach((equipo) => {
            // Buscamos el índice original del equipo en el array principal
            // Esto es necesario para que los botones de editar/eliminar funcionen
            const indexOriginal = equipos.indexOf(equipo);

            // Creamos la fila de la tabla
            const fila = document.createElement('tr');

            // Insertamos los datos del equipo
            fila.innerHTML = `
                <td>${equipo.tipo}</td>
                <td>${equipo.titular}</td>
                <td>${equipo.marca}</td>
                <td>${equipo.procesador}</td>
                <td>${equipo.ram}</td>
                <td>${equipo.almacenamiento}</td>
                <td>${equipo.video}</td>
                <td>${equipo.pulgadas}</td>
                <td class="acciones">
                    <button class="btn btn-edit" onclick="editarEquipo(${indexOriginal})">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEquipo(${indexOriginal})">Eliminar</button>
                </td>
            `;

            // Agregamos la fila al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
    }

    // Actualizamos el contador con la cantidad de equipos filtrados
    contadorEquipos.textContent = arrayFiltrado.length;
}

// FUNCIÓN PARA CANCELAR EDICIÓN

/**
 * Función: cancelarEdicion
 * Descripción: Cancela el modo edición y restaura el formulario a su estado inicial.
 * Se llama cuando el usuario presiona el botón "Cancelar Edición".
 * 
 * Parámetros: Ninguno
 * Retorna: Nada
 */
function cancelarEdicion() {
    // Reseteamos el índice de edición a null (no estamos editando)
    editandoIndex = null;
    
    // Limpiamos todos los campos del formulario
    formulario.reset();
    
    // Restauramos el título original del formulario
    formTitle.textContent = 'Registrar Nuevo Equipo';
    
    // Ocultamos el botón de cancelar
    btnCancelar.style.display = 'none';
    
    // Restauramos el texto del botón guardar
    btnGuardar.textContent = 'Guardar Equipo';
}


// EVENTOS (EVENT LISTENERS)


/**
 * Evento: submit del formulario
 * Descripción: Se ejecuta cuando el usuario presiona el botón "Guardar" o "Actualizar".
 * Prevenimos el comportamiento por defecto (recargar la página) con preventDefault().
 */
formulario.addEventListener('submit', function(evento) {
    // Prevenimos que el formulario recargue la página
    evento.preventDefault();
    
    // Llamamos a la función guardarEquipo para procesar los datos
    guardarEquipo();
});

/**
 * Evento: click en botón cancelar
 * Descripción: Se ejecuta cuando el usuario presiona "Cancelar Edición".
 * Cancela la edición y restaura el formulario.
 */
btnCancelar.addEventListener('click', function() {
    // Llamamos a la función que cancela la edición
    cancelarEdicion();
});

/**
 * Evento: input en el campo de búsqueda
 * Descripción: Se ejecuta cada vez que el usuario escribe en el buscador.
 * Realiza la búsqueda en tiempo real mientras el usuario tipea.
 */
inputBuscador.addEventListener('input', function() {
    // Llamamos a la función de búsqueda
    buscarEquipos();
});

/**
 * Evento: change en el filtro de tipo
 * Descripción: Se ejecuta cuando el usuario cambia la selección del filtro de tipo.
 * Actualiza los resultados mostrados según el tipo seleccionado.
 */
selectFiltroTipo.addEventListener('change', function() {
    // Llamamos a la función de búsqueda
    buscarEquipos();
});


// INICIALIZACIÓN


/**
 * Bloque de inicialización
 * Descripción: Se ejecuta una vez cuando la página termina de cargar.
 * Configura el estado inicial de la interfaz.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Renderizamos la tabla con el estado inicial (vacía)
    renderizarTabla();
    
    // Mostramos el mensaje de "sin equipos"
    sinEquipos.style.display = 'block';
    
    // Mensaje en consola para verificación (opcional)
    console.log('Sistema de Gestión de Equipos inicializado correctamente.');
    console.log('Nota: Los datos se guardan en memoria y se pierden al recargar la página.');
});
