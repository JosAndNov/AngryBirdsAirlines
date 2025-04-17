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
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>Vuelo #${oferta.vuelo.id}: ${oferta.vuelo.origen} → ${oferta.vuelo.destino}</h3>
          <p>Fecha: ${oferta.vuelo.fechaSalida}</p>
          <p>Hora: ${oferta.vuelo.horaSalida}</p>
          <p>Precio original: <s>$${oferta.precioOriginal}</s></p>
          <p><strong>Precio con descuento: $${oferta.precioDescuento}</strong></p>
          <button onclick="reservarVuelo(${oferta.vuelo.id})">Reservar</button>
          <hr>
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
  