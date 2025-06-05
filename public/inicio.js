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
    vueloDiv.classList.add('ticket-vuelo');
    vueloDiv.innerHTML = `
  <div class="ticket-contenido-horizontal">
    <div class="ticket-info-horizontal">
      <div class="ticket-header">
        <h3>Vuelo <span class="codigo-vuelo">#${vuelo.id}</span></h3>
        <span class="precio-vuelo">$${vuelo.precio}</span>
      </div>

      <div class="ticket-body">
        <div class="columna">
          <p><strong>Origen:</strong> ${vuelo.origen}</p>
          <p><strong>Destino:</strong> ${vuelo.destino}</p>
        </div>

        <div class="columna">
          <p><strong>Fecha:</strong> ${vuelo.fechaSalida}</p>
          <p><strong>Hora:</strong> ${vuelo.horaSalida}</p>
        </div>

        <div class="columna">
          <p><strong>Duración:</strong> ${vuelo.duracion}</p>
        </div>
      </div>
    </div>

    <div class="ticket-boton-final-lateral">
      <button class="btn-efecto" onclick="reservarVuelo('${vuelo.id}')">
        Reservar
        <div id="clip">
          <div id="leftTop" class="corner"></div>
          <div id="rightBottom" class="corner"></div>
          <div id="rightTop" class="corner"></div>
          <div id="leftBottom" class="corner"></div>
        </div>
        <span id="rightArrow" class="arrow"></span>
        <span id="leftArrow" class="arrow"></span>
      </button>
    </div>
  </div>
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
