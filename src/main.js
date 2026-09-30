import './style.css'
import { productos } from './datos.js'

// --- ESTADO GLOBAL ---
const pedido = []; // Estructura: [{ id, nombre, precio, cantidad }]
const pedidosRegistrados = [];
const ESTADOS = ['Pendiente', 'En preparación', 'Entregado'];

// 1. NUEVO: Estado del filtro para los pedidos registrados
let estadoFiltroActivo = 'Todos';

const COLORES = {
  'Pendiente': 'bg-yellow-100 border-yellow-400 text-yellow-900',
  'En preparación': 'bg-blue-100 border-blue-400 text-blue-900',
  'Entregado': 'bg-green-100 border-green-400 text-green-900'
};

// --- ELEMENTOS DEL DOM ---
const catalogo = document.getElementById('catalogo');
const listaPedido = document.getElementById('lista-pedido');
const totalElemento = document.getElementById('total');
const btnVaciar = document.getElementById('btn-vaciar');
const contenedorFiltros = document.querySelector('#filtros');
const contenedorPedidos = document.getElementById('pedidos-registrados');

// 2. NUEVO: Referencia al contenedor de filtros de pedidos
const contenedorFiltrosPedidos = document.getElementById('filtros-pedidos');

const formCliente = document.getElementById('form-cliente');
const inputNombre = document.getElementById('nombre');
const inputTelefono = document.getElementById('telefono');
const inputCorreo = document.getElementById('correo');

const errorNombre = document.getElementById('error-nombre');
const errorTelefono = document.getElementById('error-telefono');
const errorCorreo = document.getElementById('error-correo');


// ------------------------------------------------------------
// EJERCICIO 2 — MOSTRAR PRODUCTOS
// ------------------------------------------------------------
function mostrarProductos(lista) {
  catalogo.innerHTML = lista.map(p => `
    <article class="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <div>
        <h3 class="text-xl font-semibold mb-1">${p.nombre}</h3>
        <p class="text-lg font-bold text-indigo-600 mb-4">$${p.precio}</p>
      </div>
      <button data-id="${p.id}" type="button" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors w-full">
        Agregar
      </button>
    </article>
  `).join('');
}

mostrarProductos(productos);


// ------------------------------------------------------------
// EJERCICIO 3 — ARMADO DEL PEDIDO
// ------------------------------------------------------------
catalogo.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-id]');
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const productoEncontrado = productos.find(p => p.id === id);

  if (productoEncontrado) {
    const itemEnPedido = pedido.find(item => item.id === id);

    if (itemEnPedido) {
      itemEnPedido.cantidad += 1;
    } else {
      pedido.push({
        ...productoEncontrado,
        cantidad: 1
      });
    }

    mostrarPedido();
  }
});

function mostrarPedido() {
  listaPedido.innerHTML = pedido.map(item => `
    <li class="flex justify-between items-center py-2 border-b text-gray-700">
      <span>${item.nombre} (x${item.cantidad})</span>
      <span class="font-bold text-indigo-600">$${item.precio * item.cantidad}</span>
    </li>
  `).join('');

  const total = pedido.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

btnVaciar.addEventListener('click', () => {
  pedido.length = 0;
  mostrarPedido();
});


// ------------------------------------------------------------
// EJERCICIO 4 — FILTRAR POR CATEGORÍA
// ------------------------------------------------------------
if (contenedorFiltros) {
  contenedorFiltros.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-filtro');
    if (!boton) return;

    const categoria = boton.dataset.categoria;

    document.querySelectorAll('.btn-filtro').forEach(btn => {
      btn.className = 'btn-filtro bg-white text-gray-800 border px-4 py-2 rounded font-bold hover:bg-gray-100 transition';
    });

    boton.className = 'btn-filtro bg-blue-600 text-white px-4 py-2 rounded font-bold transition';

    if (categoria === 'Todos') {
      mostrarProductos(productos);
    } else {
      const productosFiltrados = productos.filter(p => p.categoria === categoria);
      mostrarProductos(productosFiltrados);
    }
  });
}


// ------------------------------------------------------------
// EJERCICIO 5 — VALIDACIÓN Y CONFIRMACIÓN DEL PEDIDO
// ------------------------------------------------------------
formCliente.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const regexTelefono = /^\d{10}$/;
  const regexCorreo = /^\S+@\S+\.\S+$/;

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

  if (pedido.length === 0) {
    alert('Tu pedido está vacío. Agrega productos o servicios antes de confirmar.');
    esValido = false;
  }

  if (esValido) {
    const totalCalculado = pedido.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

    pedidosRegistrados.push({
      id: Date.now(),
      cliente: {
        nombre: nombreVal,
        telefono: telefonoVal,
        correo: correoVal
      },
      productos: [...pedido],
      total: totalCalculado,
      estado: 'Pendiente'
    });

    pedido.length = 0;
    mostrarPedido();
    formCliente.reset();

    mostrarPedidosRegistrados();
  }
});

function mostrarError(input, elementoError, mensaje) {
  elementoError.textContent = mensaje;
  elementoError.classList.remove('hidden');
  input.classList.add('border-red-500');
  input.classList.remove('border-gray-300');
}

function limpiarError(input, elementoError) {
  elementoError.textContent = '';
  elementoError.classList.add('hidden');
  input.classList.remove('border-red-500');
  input.classList.add('border-gray-300');
}


// ------------------------------------------------------------
// EJERCICIO 6 — MOSTRAR, FILTRAR Y AVANZAR ESTADO DE PEDIDOS
// ------------------------------------------------------------

// Renderiza pedidos filtrados y actualiza contadores
function mostrarPedidosRegistrados() {
  if (!contenedorPedidos) return;

  // Actualizar los contadores en los botones
  actualizarContadores();

  // Filtrar según el botón de estado activo
  const pedidosFiltrados = estadoFiltroActivo === 'Todos'
    ? pedidosRegistrados
    : pedidosRegistrados.filter(p => p.estado === estadoFiltroActivo);

  if (pedidosFiltrados.length === 0) {
    contenedorPedidos.innerHTML = `
      <p class="text-gray-500 text-center py-6 border border-dashed rounded-lg">
        No hay pedidos en estado "${estadoFiltroActivo}".
      </p>`;
    return;
  }

  contenedorPedidos.innerHTML = pedidosFiltrados.map((p) => {
    const estiloColor = COLORES[p.estado] || 'bg-gray-100 border-gray-300';
    const esEntregado = p.estado === 'Entregado';

    const listaProductosHTML = p.productos
      .map(item => `<li>${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}</li>`)
      .join('');

    return `
      <div class="border-l-4 p-4 rounded shadow-sm ${estiloColor}">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-bold text-lg">${p.cliente.nombre}</h3>
            <p class="text-xs opacity-75">${p.cliente.telefono} | ${p.cliente.correo}</p>
          </div>
          <span class="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border bg-white/50">
            ${p.estado}
          </span>
        </div>

        <div class="my-3 border-t border-b border-black/10 py-2">
          <p class="text-xs font-semibold mb-1 uppercase">Productos:</p>
          <ul class="text-sm list-disc list-inside space-y-0.5">
            ${listaProductosHTML}
          </ul>
        </div>

        <div class="flex justify-between items-center mt-3">
          <span class="font-bold text-md">Total: $${p.total.toFixed(2)}</span>
          
          ${!esEntregado ? `
            <button 
              data-avanzar="${p.id}" 
              class="bg-gray-800 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-900 transition font-medium shadow-sm"
            >
              Avanzar estado
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Cuenta la cantidad de pedidos por cada estado
function actualizarContadores() {
  const cantTodos = pedidosRegistrados.length;
  const cantPendiente = pedidosRegistrados.filter(p => p.estado === 'Pendiente').length;
  const cantPreparacion = pedidosRegistrados.filter(p => p.estado === 'En preparación').length;
  const cantEntregado = pedidosRegistrados.filter(p => p.estado === 'Entregado').length;

  const elTodos = document.getElementById('cant-todos');
  const elPendiente = document.getElementById('cant-pendiente');
  const elPreparacion = document.getElementById('cant-preparacion');
  const elEntregado = document.getElementById('cant-entregado');

  if (elTodos) elTodos.textContent = cantTodos;
  if (elPendiente) elPendiente.textContent = cantPendiente;
  if (elPreparacion) elPreparacion.textContent = cantPreparacion;
  if (elEntregado) elEntregado.textContent = cantEntregado;
}

// Escuchar clics en los botones de filtro de pedidos
if (contenedorFiltrosPedidos) {
  contenedorFiltrosPedidos.addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-filtro-pedido');
    if (!boton) return;

    estadoFiltroActivo = boton.dataset.filtroEstado;

    document.querySelectorAll('.btn-filtro-pedido').forEach(btn => {
      btn.className = 'btn-filtro-pedido bg-gray-200 text-gray-800 border px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-300 transition';
    });
    boton.className = 'btn-filtro-pedido bg-gray-800 text-white px-3 py-1.5 rounded-full text-sm font-semibold transition';

    mostrarPedidosRegistrados();
  });
}

// Escuchar clics para avanzar el estado del pedido
if (contenedorPedidos) {
  contenedorPedidos.addEventListener('click', (evento) => {
    const botonAvanzar = evento.target.closest('[data-avanzar]');
    if (!botonAvanzar) return;

    const id = Number(botonAvanzar.dataset.avanzar);
    const pedidoEncontrado = pedidosRegistrados.find(p => p.id === id);

    if (pedidoEncontrado) {
      const indiceActual = ESTADOS.indexOf(pedidoEncontrado.estado);
      if (indiceActual < ESTADOS.length - 1) {
        pedidoEncontrado.estado = ESTADOS[indiceActual + 1];
        mostrarPedidosRegistrados();
      }
    }
  });
}