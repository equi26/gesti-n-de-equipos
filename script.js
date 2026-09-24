/**
 * Sistema de Gestión de Equipos
 * 
 * Aplicación CRUD para administrar computadoras. Permite registrar, editar,
 * eliminar, buscar y filtrar equipos, además de exportar e importar los datos
 * en formato JSON. Toda la información se persiste en localStorage.
 */

/**
 * Arreglo principal que almacena todos los equipos registrados.
 * Cada equipo es un objeto con las propiedades del formulario.
 * Los datos se persisten en localStorage para que no se pierdan
 * al cerrar o actualizar la página.
 */
let equipos = [];

/**
 * Clave utilizada en localStorage para guardar y recuperar los equipos.
 */
const STORAGE_KEY = 'equipos_gestion';

/**
 * Variable que controla si estamos editando un equipo existente.
 * Contiene el índice del equipo en el arreglo o null si es uno nuevo.
 */
let editandoIndex = null;

// 
// REFERENCIAS A ELEMENTOS DEL DOM
// 

/**
 * Se obtienen las referencias a todos los elementos HTML con los que
 * interactúa la aplicación. Esto se ejecuta una sola vez al cargar la página.
 */

// Formulario y sus campos
const formulario = document.getElementById('equipo-form');
const inputTipo = document.getElementById('tipo');
const inputTitular = document.getElementById('titular');
const inputMarca = document.getElementById('marca');
const inputProcesador = document.getElementById('procesador');
const inputRam = document.getElementById('ram');
const inputAlmacenamiento = document.getElementById('almacenamiento');
const inputVideo = document.getElementById('video');
const inputPulgadas = document.getElementById('pulgadas');
const inputEstado = document.getElementById('estado');

// Botones del formulario
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

// Búsqueda y filtros
const inputBuscador = document.getElementById('buscador');
const selectFiltroTipo = document.getElementById('filtro-tipo');
const selectFiltroEstado = document.getElementById('filtro-estado');

// Tabla, contadores y mensajes
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const contadorEquipos = document.getElementById('contador');
const sinEquipos = document.getElementById('sin-equipos');
const formTitle = document.getElementById('form-title');

// Contadores de equipos por estado
const contadorTotal = document.getElementById('contador-total');
const contadorOperativo = document.getElementById('contador-operativo');
const contadorReparacion = document.getElementById('contador-reparacion');
const contadorDescartado = document.getElementById('contador-descartado');

// Exportación e importación de datos
const btnExportar = document.getElementById('btn-exportar');
const btnImportar = document.getElementById('btn-importar');
const inputImportar = document.getElementById('input-importar');

// 
// FUNCIONES AUXILIARES
// 

/**
 * Función: obtenerClaseEstado
 * Descripción: Devuelve la clase CSS correspondiente a un estado del equipo.
 * 
 * Parámetros:
 *   - estado: Estado del equipo (Operativo, En reparación o Descartado)
 * Retorna: String con el nombre de la clase CSS
 */
function obtenerClaseEstado(estado) {
    if (estado === 'Operativo') return 'operativo';
    if (estado === 'En reparación') return 'reparacion';
    if (estado === 'Descartado') return 'descartado';
    return 'operativo';
}

/**
 * Función: actualizarContadores
 * Descripción: Actualiza los contadores de la interfaz mostrando la cantidad
 * total de equipos registrados y la cantidad correspondiente a cada estado.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada (modifica el DOM)
 */
function actualizarContadores() {
    contadorTotal.textContent = equipos.length;
    contadorOperativo.textContent = equipos.filter(equipo => equipo.estado === 'Operativo').length;
    contadorReparacion.textContent = equipos.filter(equipo => equipo.estado === 'En reparación').length;
    contadorDescartado.textContent = equipos.filter(equipo => equipo.estado === 'Descartado').length;
}

// 
// FUNCIONES DE PERSISTENCIA (LOCALSTORAGE)
// 

/**
 * Función: guardarEnLocalStorage
 * Descripción: Guarda el arreglo de equipos en localStorage como texto JSON.
 * Se llama después de cada operación que modifica los datos (guardar, editar,
 * eliminar e importar), de modo que la información permanezca almacenada
 * aunque se cierre o actualice la página.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada
 */
function guardarEnLocalStorage() {
    // Guardamos el arreglo completo de equipos bajo la clave STORAGE_KEY.
    // JSON.stringify convierte el arreglo de objetos en texto JSON,
    // que es el único formato que localStorage puede almacenar.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipos));
}

/**
 * Función: cargarDeLocalStorage
 * Descripción: Recupera los equipos almacenados en localStorage cuando la
 * página se abre o se actualiza. Si no hay datos guardados o el JSON es
 * inválido, deja el arreglo vacío para iniciar sin registros.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada
 */
function cargarDeLocalStorage() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);

    if (datosGuardados) {
        try {
            // Convertimos el texto JSON obtenido de localStorage nuevamente
            // en un arreglo de objetos con JSON.parse.
            equipos = JSON.parse(datosGuardados);

            // Normalizamos los registros para que todos tengan un estado.
            // Es útil por si existen datos guardados de versiones anteriores
            // que aún no contaban con el campo 'estado'.
            equipos = equipos.map(equipo => {
                if (!equipo.estado) {
                    equipo.estado = 'Operativo';
                }
                return equipo;
            });
        } catch (error) {
            // Si el contenido guardado está corrupto, no se puede leer,
            // así que reiniciamos el arreglo para evitar errores.
            console.error('Error al leer los datos de localStorage:', error);
            equipos = [];
        }
    }
}

// 
// FUNCIONES DE RENDERIZADO (MOSTRAR DATOS)
// 

/**
 * Función: renderizarTabla
 * Descripción: Actualiza la tabla HTML con todos los equipos del arreglo,
 * generando las filas dinámicamente. También actualiza el contador general,
 * el mensaje de "sin equipos" y los contadores por estado.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada (modifica el DOM directamente)
 */
function renderizarTabla() {
    cuerpoTabla.innerHTML = '';

    if (equipos.length === 0) {
        sinEquipos.style.display = 'block';
    } else {
        sinEquipos.style.display = 'none';

        equipos.forEach((equipo, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${equipo.tipo}</td>
                <td>${equipo.titular}</td>
                <td>${equipo.marca}</td>
                <td>${equipo.procesador}</td>
                <td>${equipo.ram}</td>
                <td>${equipo.almacenamiento}</td>
                <td>${equipo.video}</td>
                <td>${equipo.pulgadas}</td>
                <td><span class="estado-badge estado-${obtenerClaseEstado(equipo.estado)}">${equipo.estado}</span></td>
                <td class="acciones">
                    <button class="btn btn-edit" onclick="editarEquipo(${index})">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEquipo(${index})">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    contadorEquipos.textContent = equipos.length;
    actualizarContadores();
}

// 
// FUNCIONES CRUD - CREAR (GUARDAR)
// 

/**
 * Función: guardarEquipo
 * Descripción: Toma los datos del formulario y los guarda en el arreglo.
 * Si se está editando un equipo existente, lo actualiza; si es uno nuevo, lo
 * agrega al final del arreglo. Luego persiste los cambios en localStorage.
 * 
 * Parámetros: Ninguno (lee los valores directamente del DOM)
 * Retorna: Nada
 */
function guardarEquipo() {
    if (!inputTipo.value || !inputTitular.value || !inputMarca.value ||
        !inputProcesador.value || !inputRam.value || !inputAlmacenamiento.value ||
        !inputVideo.value || !inputPulgadas.value) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const nuevoEquipo = {
        tipo: inputTipo.value,
        titular: inputTitular.value.trim(),
        marca: inputMarca.value.trim(),
        procesador: inputProcesador.value.trim(),
        ram: inputRam.value.trim(),
        almacenamiento: inputAlmacenamiento.value.trim(),
        video: inputVideo.value.trim(),
        pulgadas: inputPulgadas.value.trim(),
        estado: inputEstado.value
    };

    if (editandoIndex !== null) {
        equipos[editandoIndex] = nuevoEquipo;
        alert('Equipo actualizado correctamente.');
        editandoIndex = null;
        formTitle.textContent = 'Registrar Nuevo Equipo';
        btnCancelar.style.display = 'none';
        btnGuardar.textContent = 'Guardar Equipo';
    } else {
        equipos.push(nuevoEquipo);
        alert('Equipo guardado correctamente.');
    }

    guardarEnLocalStorage();
    formulario.reset();
    renderizarTabla();
}

// 
// FUNCIONES CRUD - EDITAR (ACTUALIZAR)
// 

/**
 * Función: editarEquipo
 * Descripción: Carga los datos de un equipo del arreglo en el formulario,
 * permitiendo modificarlos. Cambia el formulario a modo edición.
 * 
 * Parámetros:
 *   - index: Posición del equipo en el arreglo 'equipos'
 * Retorna: Nada
 */
function editarEquipo(index) {
    const equipo = equipos[index];

    inputTipo.value = equipo.tipo;
    inputTitular.value = equipo.titular;
    inputMarca.value = equipo.marca;
    inputProcesador.value = equipo.procesador;
    inputRam.value = equipo.ram;
    inputAlmacenamiento.value = equipo.almacenamiento;
    inputVideo.value = equipo.video;
    inputPulgadas.value = equipo.pulgadas;
    inputEstado.value = equipo.estado || 'Operativo';

    editandoIndex = index;
    formTitle.textContent = 'Editar Equipo';
    btnCancelar.style.display = 'inline-block';
    btnGuardar.textContent = 'Actualizar Equipo';

    formulario.scrollIntoView({ behavior: 'smooth' });
}

// 
// FUNCIONES CRUD - ELIMINAR
// 

/**
 * Función: eliminarEquipo
 * Descripción: Elimina un equipo del arreglo tras confirmación del usuario.
 * Muestra una ventana de confirmación antes de borrar permanentemente y
 * persiste el cambio en localStorage.
 * 
 * Parámetros:
 *   - index: Posición del equipo en el arreglo 'equipos'
 * Retorna: Nada
 */
function eliminarEquipo(index) {
    const nombreTitular = equipos[index].titular;
    const confirmar = confirm(`¿Está seguro que desea eliminar el equipo de "${nombreTitular}"?`);

    if (confirmar) {
        equipos.splice(index, 1);

        if (editandoIndex === index) {
            cancelarEdicion();
        }

        guardarEnLocalStorage();
        alert('Equipo eliminado correctamente.');
        renderizarTabla();
    }
}

// 
// FUNCIONES CRUD - BUSCAR (LEER/FILTRAR)
// 

/**
 * Función: buscarEquipos
 * Descripción: Filtra los equipos según el texto de búsqueda, el tipo y el
 * estado seleccionados. La búsqueda funciona en tiempo real (cada vez que el
 * usuario escribe o cambia un filtro) y se busca coincidencias parciales en
 * titular, tipo, marca y procesador.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada (actualiza la tabla directamente)
 */
function buscarEquipos() {
    const textoBusqueda = inputBuscador.value.toLowerCase().trim();
    const tipoFiltro = selectFiltroTipo.value;
    const estadoFiltro = selectFiltroEstado.value;

    const equiposFiltrados = equipos.filter(equipo => {
        const coincideTexto = !textoBusqueda || 
            equipo.titular.toLowerCase().includes(textoBusqueda) ||
            equipo.tipo.toLowerCase().includes(textoBusqueda) ||
            equipo.marca.toLowerCase().includes(textoBusqueda) ||
            equipo.procesador.toLowerCase().includes(textoBusqueda);

        const coincideTipo = !tipoFiltro || equipo.tipo === tipoFiltro;
        const coincideEstado = !estadoFiltro || equipo.estado === estadoFiltro;

        return coincideTexto && coincideTipo && coincideEstado;
    });

    renderizarTablaFiltrada(equiposFiltrados);
}

/**
 * Función: renderizarTablaFiltrada
 * Descripción: Muestra en la tabla únicamente los equipos que coinciden con
 * los criterios de búsqueda. Es similar a renderizarTabla() pero trabaja con
 * el arreglo de equipos filtrado.
 * 
 * Parámetros:
 *   - arrayFiltrado: Arreglo de equipos que coinciden con la búsqueda
 * Retorna: Nada (modifica el DOM)
 */
function renderizarTablaFiltrada(arrayFiltrado) {
    cuerpoTabla.innerHTML = '';

    if (arrayFiltrado.length === 0) {
        sinEquipos.style.display = 'block';
        sinEquipos.querySelector('p').textContent = 'No se encontraron equipos con esos criterios.';
    } else {
        sinEquipos.style.display = 'none';

        arrayFiltrado.forEach((equipo) => {
            const indexOriginal = equipos.indexOf(equipo);
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${equipo.tipo}</td>
                <td>${equipo.titular}</td>
                <td>${equipo.marca}</td>
                <td>${equipo.procesador}</td>
                <td>${equipo.ram}</td>
                <td>${equipo.almacenamiento}</td>
                <td>${equipo.video}</td>
                <td>${equipo.pulgadas}</td>
                <td><span class="estado-badge estado-${obtenerClaseEstado(equipo.estado)}">${equipo.estado}</span></td>
                <td class="acciones">
                    <button class="btn btn-edit" onclick="editarEquipo(${indexOriginal})">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEquipo(${indexOriginal})">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    contadorEquipos.textContent = arrayFiltrado.length;
    actualizarContadores();
}

// 
// FUNCIÓN PARA CANCELAR EDICIÓN
// 

/**
 * Función: cancelarEdicion
 * Descripción: Cancela el modo edición y restaura el formulario a su estado
 * inicial. Se llama cuando el usuario presiona el botón "Cancelar Edición".
 * 
 * Parámetros: Ninguno
 * Retorna: Nada
 */
function cancelarEdicion() {
    editandoIndex = null;
    formulario.reset();
    formTitle.textContent = 'Registrar Nuevo Equipo';
    btnCancelar.style.display = 'none';
    btnGuardar.textContent = 'Guardar Equipo';
}

// 
// FUNCIONES DE EXPORTACIÓN E IMPORTACIÓN
// 

/**
 * Función: exportarJSON
 * Descripción: Descarga un archivo JSON con todos los equipos registrados.
 * Crea un objeto Blob con el contenido, genera una URL temporal y simula un
 * clic en un enlace de descarga para guardar el archivo en el equipo.
 * 
 * Parámetros: Ninguno
 * Retorna: Nada
 */
function exportarJSON() {
    if (equipos.length === 0) {
        alert('No hay equipos registrados para exportar.');
        return;
    }

    const blob = new Blob([JSON.stringify(equipos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.download = 'equipos.json';
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    document.body.removeChild(enlaceDescarga);
    URL.revokeObjectURL(url);

    alert(`Se exportaron ${equipos.length} equipos correctamente.`);
}

/**
 * Función: importarJSON
 * Descripción: Lee un archivo JSON seleccionado por el usuario y carga los
 * equipos en el sistema, reemplazando los registros actuales. Valida que el
 * archivo contenga un arreglo y persiste los datos importados.
 * 
 * Parámetros:
 *   - evento: Objeto del evento change del input de archivo
 * Retorna: Nada
 */
function importarJSON(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function(resultado) {
        try {
            const datos = JSON.parse(resultado.target.result);

            if (!Array.isArray(datos)) {
                throw new Error('El archivo debe contener un listado de equipos.');
            }

            equipos = datos.map(equipo => {
                if (!equipo.estado) {
                    equipo.estado = 'Operativo';
                }
                return equipo;
            });

            guardarEnLocalStorage();
            renderizarTabla();

            alert(`Se importaron ${equipos.length} equipos correctamente.`);
        } catch (error) {
            alert('Error al importar el archivo: ' + error.message);
        }
    };
    lector.readAsText(archivo);
    evento.target.value = '';
}

// 
// EVENTOS (EVENT LISTENERS)
// 

/**
 * Evento: submit del formulario
 * Descripción: Se ejecuta al presionar "Guardar" o "Actualizar". Se previene
 * el comportamiento por defecto (recarga de la página) con preventDefault().
 */
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    guardarEquipo();
});

/**
 * Evento: click en botón cancelar
 * Descripción: Cancela la edición y restaura el formulario.
 */
btnCancelar.addEventListener('click', function() {
    cancelarEdicion();
});

/**
 * Evento: input en el campo de búsqueda
 * Descripción: Realiza la búsqueda en tiempo real mientras el usuario escribe.
 */
inputBuscador.addEventListener('input', function() {
    buscarEquipos();
});

/**
 * Evento: change en el filtro de tipo
 * Descripción: Actualiza los resultados mostrados según el tipo seleccionado.
 */
selectFiltroTipo.addEventListener('change', function() {
    buscarEquipos();
});

/**
 * Evento: change en el filtro de estado
 * Descripción: Actualiza los resultados mostrados según el estado seleccionado.
 */
selectFiltroEstado.addEventListener('change', function() {
    buscarEquipos();
});

/**
 * Evento: click en botón exportar
 * Descripción: Exporta los equipos registrados a un archivo JSON.
 */
btnExportar.addEventListener('click', function() {
    exportarJSON();
});

/**
 * Evento: click en botón importar
 * Descripción: Abre el selector de archivos para elegir un archivo JSON.
 */
btnImportar.addEventListener('click', function() {
    inputImportar.click();
});

/**
 * Evento: change en el input de archivo
 * Descripción: Procesa el archivo JSON seleccionado e importa los equipos.
 */
inputImportar.addEventListener('change', function(evento) {
    importarJSON(evento);
});

// 
// INICIALIZACIÓN
// 

/**
 * Bloque de inicialización
 * Descripción: Se ejecuta una vez cuando la página termina de cargar.
 * Carga los equipos persistidos en localStorage y renderiza la interfaz.
 */
document.addEventListener('DOMContentLoaded', function() {
    cargarDeLocalStorage();
    renderizarTabla();

    console.log('Sistema de Gestión de Equipos inicializado correctamente.');
    console.log('Los datos se cargan desde localStorage y se persisten automáticamente.');
});