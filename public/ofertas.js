window.addEventListener('DOMContentLoaded', async () => {
    const usuario = localStorage.getItem('usuario');
    const usuarioAcciones = document.getElementById('usuarioAcciones');
    const saludoUsuario = document.getElementById('saludoUsuario');
    const listaOfertas = document.getElementById('listaOfertas');
  
    if (usuario) {
      usuarioAcciones.innerHTML = `<a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`;
      saludoUsuario.innerText = `Bienvenido, ${usuario}`;
    } else {
      usuarioAcciones.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;
    }
  
    try {
      const res = await fetch('/api/ofertas');
      const data = await res.json();
  
      if (!res.ok) {
        listaOfertas.innerText = data.mensaje || 'No hay ofertas disponibles.';
        return;
      }
  
      data.ofertas.forEach(oferta => {
        const vuelo = oferta.vuelo;
        const div = document.createElement('div');
        div.classList.add('ticket-vuelo'); // usa el mismo estilo
        div.innerHTML = `
  <div class="ticket-contenido-horizontal">
    <div class="ticket-info-horizontal">
      <div class="ticket-oferta-header">
        <h3>🔥 Oferta - Vuelo <span class="codigo-vuelo">#${vuelo.id}</span></h3>
        <span class="badge-oferta">${oferta.porcentaje}% OFF</span>
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
          <p><strong>Precio antes:</strong> <span class="precio-antes">$${vuelo.precio}</span></p>
          <p><strong>Precio ahora:</strong> <span class="precio-descuento">$${Math.round(vuelo.precio * (1 - oferta.porcentaje / 100))}</span></p>
        </div>
      </div>
    </div>

    <div class="ticket-oferta-boton-contenedor">
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

  listaOfertas.appendChild(div);
});
      
      
    } catch (error) {
      console.error(error);
      listaOfertas.innerText = 'Error al cargar ofertas.';
    }
  });
  
  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/ofertas.html';
  }
  
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
  