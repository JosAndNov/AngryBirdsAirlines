window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const saludo = document.getElementById('saludoUsuario');
    const contenedor = document.getElementById('reservasContainer');
    const acciones = document.getElementById('usuarioAcciones');
  
    // Redirección si no hay token
    if (!token) {
      alert('Debes iniciar sesión para ver tus reservas.');
      window.location.href = '/login.html';
      return;
    }
  
    // Barra superior y saludo
    if (usuario) {
      acciones.innerHTML = `<a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`;
      saludo.innerText = `👤 Bienvenido, ${usuario}`;
    }
  
    try {
      const res = await fetch('/api/tuvuelo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        contenedor.innerText = data.mensaje || 'No tienes reservas activas.';
        return;
      }
  
      data.reservas.forEach(r => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>✈️ Vuelo #${r.vuelo.id} - ${r.vuelo.origen} → ${r.vuelo.destino}</h3>
          <p><strong>Código de Reserva:</strong> ${r.codigoReserva}</p>
          <p><strong>Fecha:</strong> ${r.vuelo.fechaSalida}</p>
          <p><strong>Hora:</strong> ${r.vuelo.horaSalida}</p>
          <p><strong>Precio:</strong> $${r.vuelo.precio}</p>
          <p><strong>Titular:</strong> ${r.titularReserva}</p>
          <p><strong>Correo de la reserva:</strong> ${r.correoReserva}</p>
          <h4>Pasajeros:</h4>
          <ul>
            ${r.pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
          </ul>
          <button onclick="window.location.href='/modificar.html?reserva=${r.codigoReserva}'">✏️ Modificar reserva</button>
          <button onclick="cancelarReserva('${r.codigoReserva}')">❌ Cancelar reserva</button>
          <hr>
        `;
        contenedor.appendChild(div);
      });
  
    } catch (err) {
      console.error(err);
      contenedor.innerText = '❌ Error al cargar reservas.';
    }
  });
  
  // Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/inicio.html';
  }
  
  function cancelarReserva(codigoReserva) {
    alert(`Funcionalidad de cancelación en desarrollo para ${codigoReserva}`);
    // Aquí después haremos la petición DELETE o PATCH con validaciones
  }