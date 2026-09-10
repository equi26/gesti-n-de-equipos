# Gestión de Equipos

Sistema web interactivo para la administración de computadoras con operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

## Descripción

Aplicación desarrollada con HTML, CSS y JavaScript puro que permite gestionar un registro de equipos de cómputo. La información se almacena temporalmente en memoria (arreglos de JavaScript), por lo que se pierde al recargar la página.

## Características

- **Registrar equipos:** Formulario completo con los campos: tipo de computadora, titular, marca, procesador, memoria RAM, almacenamiento, placa de video y pulgadas de pantalla.
- **Buscar equipos:** Búsqueda en tiempo real por nombre del titular, tipo o marca. Filtro por tipo de equipo.
- **Editar equipos:** Botón "Editar" que carga los datos en el formulario para modificarlos.
- **Eliminar equipos:** Botón "Eliminar" con confirmación antes de borrar.

## Cómo utilizarlo

1. Descarga o clona el repositorio:
   ```bash
   git clone https://github.com/equi26/gesti-n-de-equipos.git
   ```
2. Abre el archivo `index.html` en tu navegador.
3. Completa el formulario y presiona "Guardar Equipo".
4. Usa la barra de búsqueda para encontrar equipos específicos.
5. Presiona "Editar" para modificar un equipo o "Eliminar" para borrarlo.

## Tecnologías

- HTML5
- CSS3 (diseño responsive con gradientes y animaciones)
- JavaScript Vanilla (manipulación del DOM)
