window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const acciones = document.getElementById('usuarioAcciones');
    const saludo = document.getElementById('saludoUsuario');
    const contenedor = document.getElementById('vuelosDisponibles');
  
    if (!token) {
      alert('Debes iniciar sesión para cambiar la fecha.');
      window.location.href = '/login.html';
      return;
    }
  
    if (usuario) {
      saludo.innerText = `👤 Bienvenido, ${usuario}`;
    }
  
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const codigoReserva = params.get('reserva');
    const origen = params.get('origen');
    const destino = params.get('destino');
  
    if (!codigoReserva || !origen || !destino) {
      contenedor.innerHTML = '❌ Error: datos incompletos.';
      return;
    }
  
    try {
      const res = await fetch(`/api/tuvuelo/opciones/${codigoReserva}?origen=${origen}&destino=${destino}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        contenedor.innerText = data.mensaje || '❌ Error al buscar opciones de vuelo.';
        return;
      }
  
      if (data.vuelos.length === 0) {
        contenedor.innerHTML = '😔 No hay vuelos disponibles para cambiar.';
        return;
      }
  
      contenedor.innerHTML = '';
  
      data.vuelos.forEach(vuelo => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>✈️ Vuelo #${vuelo.id}: ${vuelo.origen} → ${vuelo.destino}</h3>
          <p><strong>Fecha:</strong> ${vuelo.fechaSalida}</p>
          <p><strong>Hora:</strong> ${vuelo.horaSalida}</p>
          <p><strong>Precio:</strong> $${vuelo.precio}</p>
          <button onclick="cambiarAVuelo('${codigoReserva}', '${vuelo.id}')">🔄 Cambiar a este vuelo</button>
          <hr>
        `;
        contenedor.appendChild(div);
      });
  
    } catch (error) {
      console.error(error);
      contenedor.innerText = '❌ Error inesperado al cargar vuelos.';
    }
  });
  
  async function cambiarAVuelo(codigoReserva, nuevoVueloId) {
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch('/api/tuvuelo/cambiar-fecha', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoReserva, nuevoVueloId })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.mensaje || '❌ Error al cambiar de vuelo.');
        return;
      }
  
      if (data.necesitaPagoExtra) {
        const ultimos4 = data.ultimos4 || '****';
        document.getElementById('textoPagoExtra').innerHTML = `
          💳 El nuevo vuelo tiene un costo adicional de <strong>$${data.diferencia}</strong> por todos los pasajeros.<br><br>
          ¿Deseas aceptar el cargo a tu tarjeta terminada en ${ultimos4}?
        `;
        document.getElementById('modalPagoExtra').style.display = 'block';
  
        document.getElementById('btnAceptarPago').onclick = async () => {
          await confirmarCambio(codigoReserva, nuevoVueloId);
        };
        document.getElementById('btnCancelarPago').onclick = () => {
          document.getElementById('modalPagoExtra').style.display = 'none';
        };
  
      } else {
        mostrarConfirmacion(data);
      }
  
    } catch (error) {
      console.error(error);
      alert('❌ Error inesperado al cambiar vuelo.');
    }
  }
  
  async function confirmarCambio(codigoReserva, nuevoVueloId) {
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch('/api/tuvuelo/confirmar-cambio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoReserva, nuevoVueloId })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.mensaje || '❌ Error al confirmar cambio.');
        return;
      }
  
      document.getElementById('modalPagoExtra').style.display = 'none';
      mostrarConfirmacion(data);
  
    } catch (error) {
      console.error(error);
      alert('❌ Error inesperado al confirmar cambio.');
    }
  }
  
  function mostrarConfirmacion(data) {
    const contenido = document.getElementById('contenidoCambio');
    contenido.innerHTML = `
      <p><strong>Nuevo vuelo:</strong> ${data.datosVuelo.origen} → ${data.datosVuelo.destino}</p>
      <p><strong>Fecha:</strong> ${data.datosVuelo.fechaSalida}</p>
      <p><strong>Hora:</strong> ${data.datosVuelo.horaSalida}</p>
      <p><strong>Total actualizado:</strong> $${data.total}</p>
    `;
    document.getElementById('modalCambioConfirmado').style.display = 'block';
  
    document.addEventListener('click', () => {
      const modal = document.getElementById('modalCambioConfirmado');
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        window.location.href = '/tuvuelo.html';
      }
    }, { once: true });
  }
  
  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/inicio.html';
  }
  