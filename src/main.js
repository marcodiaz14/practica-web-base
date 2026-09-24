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
