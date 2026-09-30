import './style.css'
import { productos } from './datos.js'

// Elemento donde se dibujan las tarjetas (lo creas en el Ejercicio 1)
const catalogo = document.getElementById('catalogo')

// ------------------------------------------------------------
// EJERCICIO 2 — mostrarProductos(lista)
// Convierte una lista de productos en tarjetas HTML y las pone en la página.
// Forma general:
//   catalogo.innerHTML = lista.map(p => `
//     <article class="...las mismas clases de tu Ejercicio 1...">
//       <h3>${p.nombre}</h3>
//       ...
//       <button data-id="${p.id}">Agregar</button>
//     </article>
//   `).join('')
// ------------------------------------------------------------
function mostrarProductos(lista) {
  // Escribe aquí tu código
    catalogo.innerHTML = lista.map(p => `
     <article class=class="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
       <h3 class="text-xl font-semibold mb-2">${p.nombre}</h3>
        <h3 class="text-xl font-semibold mb-2">$${p.precio}</h3>
      
       <button data-id="${p.id}" type="button" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors w-full">Agregar</button>
     </article>
   `).join('')
}

mostrarProductos(productos)

// ------------------------------------------------------------
// EJERCICIO 3 — Armar el pedido
// El pedido es un arreglo con los productos que la persona va agregando.
// Pasos (detalle en el README):
//   1. Escucha el clic en el contenedor #catalogo (delegación de eventos).
//   2. Busca el producto por id con .find() y agrégalo con .push().
//   3. Dibuja el pedido con mostrarPedido() y calcula el total con .reduce().
//   4. Botón "Vaciar pedido".
// ------------------------------------------------------------
const pedido = []


catalogo.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-id]');
  if (!boton) return;

  const id = Number(boton.dataset.id);

  const productoEncontrado = productos.find(p => p.id === id);

  if (productoEncontrado) {
    pedido.push(productoEncontrado);

    mostrarPedido();
  }
});
const listaPedido = document.getElementById('lista-pedido');
const totalElemento = document.getElementById('total');

function mostrarPedido() {
  // 1. Dibuja cada producto del pedido dentro de #lista-pedido usando .map() y .join('')
  listaPedido.innerHTML = pedido.map(p => `
    <li class="flex justify-between items-center py-2 border-b text-gray-700">
      <span>${p.nombre}</span>
      <span class="font-bold text-indigo-600">$${p.precio}</span>
    </li>
  `).join('');

  const total = pedido.reduce((suma, p) => suma + p.precio, 0);

  totalElemento.textContent = `Total: $${total}`;
}
const btnVaciar = document.getElementById('btn-vaciar');
btnVaciar.addEventListener('click', () => {
  pedido.length = 0;
  mostrarPedido();
});
// ------------------------------------------------------------
// EJERCICIO 4 — Filtrar por categoría
// Botones de categoría que llamen a mostrarProductos() con
// productos.filter(...). El botón "Todos" muestra la lista completa.
// ------------------------------------------------------------

// Escribe aquí tu código del Ejercicio 4
mostrarProductos(productos);

// --- CÓDIGO DEL EJERCICIO 4 (Filtros) ---
const contenedorFiltros = document.querySelector('#filtros');

contenedorFiltros.addEventListener('click', (evento) => {
  // Verificamos que se haya hecho clic en un botón de filtro
  const boton = evento.target.closest('.btn-filtro');
  if (!boton) return;

  const categoria = boton.dataset.categoria;

  // 1. Quitar el color azul a todos los botones y ponerlos blancos
  document.querySelectorAll('.btn-filtro').forEach(btn => {
    // CORREGIDO: Usamos bg-white en lugar de bg-blue
    btn.className = 'btn-filtro bg-white text-gray-800 border px-4 py-2 rounded font-bold hover:bg-gray-100 transition';
  });

  // 2. Ponerle el color azul solo al botón que recibió el clic
  boton.className = 'btn-filtro bg-blue-600 text-white px-4 py-2 rounded font-bold transition';

  // 3. Filtrar los productos
  if (categoria === 'Todos') {
    mostrarProductos(productos);
  } else {
    // Si eligió una categoría, crea una lista solo con los que coincidan
    const productosFiltrados = productos.filter(p => p.servicio === categoria);
    mostrarProductos(productosFiltrados);
  }
  if (categoria === 'servicio') {
    mostrarProductos(productos);
  } else {
    // Si eligió una categoría, crea una lista solo con los que coincidan
    const productosFiltrados = productos.filter(p => p.categoria === categoria);
    mostrarProductos(productosFiltrados);
  }
});
catalogo.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-id]');
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const productoEncontrado = productos.find(p => p.id === id);

  if (productoEncontrado) {
    // 1. Buscamos si el producto ya está en el pedido
    const itemEnPedido = pedido.find(item => item.producto.id === id);

    if (itemEnPedido) {
      // Si ya existe, solo incrementamos su cantidad
      itemEnPedido.cantidad += 1;
    } else {
      // Si no existe, lo agregamos con cantidad inicial de 1
      pedido.push({
        producto: productoEncontrado,
        cantidad: 1
      });
    }

    // 2. Redibujamos el pedido
    mostrarPedido();
  }
});
// Selección de elementos del DOM
const formCliente = document.getElementById('form-cliente');

const inputNombre = document.getElementById('nombre');
const inputTelefono = document.getElementById('telefono');
const inputCorreo = document.getElementById('correo');

const errorNombre = document.getElementById('error-nombre');
const errorTelefono = document.getElementById('error-telefono');
const errorCorreo = document.getElementById('error-correo');

// Escuchar el evento submit del formulario
formCliente.addEventListener('submit', (evento) => {
  // Evitar que la página se recargue al enviar el formulario
  evento.preventDefault();

  // Expresiones regulares para validación
  const regexTelefono = /^\d{10}$/;
  const regexCorreo = /^\S+@\S+\.\S+$/;

  // Obtener valores limpios
  const nombreVal = inputNombre.value.trim();
  const telefonoVal = inputTelefono.value.trim();
  const correoVal = inputCorreo.value.trim();

  let esValido = true;

 
  if (nombreVal === '') {
    mostrarError(inputNombre, errorNombre, 'El nombre no puede estar vacío.');
    esValido = false;
  } else {
    limpiarError(inputNombre, errorNombre);
  }


  if (!regexTelefono.test(telefonoVal)) {
    mostrarError(inputTelefono, errorTelefono, 'El teléfono debe tener exactamente 10 dígitos.');
    esValido = false;
  } else {
    limpiarError(inputTelefono, errorTelefono);
  }

  
  if (!regexCorreo.test(correoVal)) {
    mostrarError(inputCorreo, errorCorreo, 'Ingresa un correo electrónico válido (ejemplo@dominio.com).');
    esValido = false;
  } else {
    limpiarError(inputCorreo, errorCorreo);
  }

  
  const listaPedido = document.getElementById('lista-pedido');
  // Se verifica si hay elementos <li> dentro de la lista del pedido
  if (!listaPedido || listaPedido.children.length === 0) {
    alert('Tu pedido está vacío. Agrega productos o servicios antes de confirmar.');
    esValido = false;
  }

  if (esValido) {
    alert('¡Pedido confirmado con éxito!');
    // Aquí puedes vaciar el carrito o resetear el formulario si lo necesitas:
    // formCliente.reset();
  }
});

// Función auxiliar para mostrar mensaje de error y marcar el campo en rojo
function mostrarError(input, elementoError, mensaje) {
  elementoError.textContent = mensaje;
  elementoError.classList.remove('hidden');
  input.classList.add('border-red-500');
  input.classList.remove('border-gray-300');
}

// Función auxiliar para ocultar el mensaje de error y restaurar el borde
function limpiarError(input, elementoError) {
  elementoError.textContent = '';
  elementoError.classList.add('hidden');
  input.classList.remove('border-red-500');
  input.classList.add('border-gray-300');
}
 