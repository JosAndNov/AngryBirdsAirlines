const formBusqueda = document.getElementById('formBusqueda');
const resultadoVuelos = document.getElementById('resultadoVuelos');

window.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario');
  const usuarioAcciones = document.getElementById('usuarioAcciones');
  const saludoUsuario = document.getElementById('saludoUsuario');

  if (usuario) {
    usuarioAcciones.innerHTML = `<a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`;
    saludoUsuario.innerText = `Bienvenido, ${usuario}`;
  } else {
    usuarioAcciones.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;
  }
});

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/inicio.html';
}

formBusqueda.addEventListener('submit', async (e) => {
  e.preventDefault();

  const origen = document.getElementById('origen').value.trim();
  const destino = document.getElementById('destino').value.trim();
  const fecha = document.getElementById('fecha').value;

  const res = await fetch(`/api/vuelos?origen=${origen}&destino=${destino}&fecha=${fecha}`);
  const data = await res.json();

  resultadoVuelos.innerHTML = ''; // Limpiar resultados anteriores

  if (!res.ok) {
    resultadoVuelos.innerText = data.mensaje || 'No se encontraron vuelos.';
    return;
  }

  data.vuelos.forEach(vuelo => {
    const vueloDiv = document.createElement('div');
    vueloDiv.innerHTML = `
      <h3>Vuelo #${vuelo.id}</h3>
      <p>Origen: ${vuelo.origen}</p>
      <p>Destino: ${vuelo.destino}</p>
      <p>Fecha de salida: ${vuelo.fechaSalida}</p>
      <p>Hora de salida: ${vuelo.horaSalida}</p>
      <p>Duración: ${vuelo.duracion}</p>
      <p>Precio: $${vuelo.precio}</p>
      <button onclick="reservarVuelo(${vuelo.id})">Reservar</button>
      <hr>
    `;
    resultadoVuelos.appendChild(vueloDiv);
  });
});

function reservarVuelo(vueloId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para reservar');
    window.location.href = '/login.html';
    return;
  }

  // Redirigir a la página de reserva con el ID del vuelo
  window.location.href = `/reservar.html?vuelo=${vueloId}`;
}

window.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario');
  const navLogin = document.getElementById('navLogin');
  const usuarioInfo = document.getElementById('usuarioInfo');

  if (usuario) {
    navLogin.innerHTML = `<a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`;
    usuarioInfo.innerText = `Bienvenido, ${usuario}`;
  } else {
    navLogin.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;
  }
});

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/inicio.html';
}
