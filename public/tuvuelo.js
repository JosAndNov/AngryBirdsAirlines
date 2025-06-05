window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  const saludo = document.getElementById('saludoUsuario');
  const contenedor = document.getElementById('reservasContainer');
  const acciones = document.getElementById('usuarioAcciones');

  if (!token) {
    alert('Debes iniciar sesión para ver tus reservas.');
    window.location.href = '/login.html';
    return;
  }

  if (usuario) {
    acciones.innerHTML = `<a href="#" onclick="cerrarSesion()">Cerrar sesión</a>`;
    saludo.innerText = `Bienvenido, ${usuario}`;
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
      div.classList.add("ticket-vuelo");
div.innerHTML = `
  <div class="ticket-contenido-horizontal">
    <div class="ticket-info-horizontal">
      <div class="ticket-header">
        <h3>✈️ Vuelo <span class="codigo-vuelo">#${r.vuelo.id}</span> - ${r.vuelo.origen} → ${r.vuelo.destino}</h3>
        <span class="precio-vuelo">$${r.vuelo.precio}</span>
      </div>

      <div class="ticket-body">
        <div class="columna">
          <p><strong>Fecha:</strong> ${r.vuelo.fechaSalida}</p>
          <p><strong>Hora:</strong> ${r.vuelo.horaSalida}</p>
          <p><strong>Cod. reserva:</strong> ${r.codigoReserva}</p>
        </div>
        <div class="columna">
          <p><strong>Titular:</strong> ${r.titularReserva}</p>
          <p><strong>Correo:</strong> ${r.correoReserva}</p>
          <p><strong>Total:</strong> $${r.total}</p>
        </div>
        <div class="columna pasajeros">
  <p><strong>Pasajeros:</strong></p>
  <ul class="lista-pasajeros">
    ${r.pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
  </ul>
</div>
      </div>
    </div>

    <div class="ticket-boton-triple">
      <button class="btn-efecto" onclick="modificarReserva('${r.codigoReserva}')">✏️ Modificar</button>
      <button class="btn-efecto" onclick="cancelarReserva('${r.codigoReserva}', '${r.vuelo.id}')">❌ Cancelar</button>
      <button class="btn-efecto" onclick="cambiarFecha('${r.codigoReserva}', '${r.vuelo.origen}', '${r.vuelo.destino}', '${r.vuelo.id}')">🔄 Cambiar fecha</button>
    </div>
  </div>
`;
contenedor.appendChild(div);

    });

  } catch (err) {
    console.error(err);
    contenedor.innerText = '❌ Error al cargar reservas.';
  }
});

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/inicio.html';
}

function modificarReserva(codigoReserva) {
  window.location.href = `/modificar.html?reserva=${codigoReserva}`;
}

async function cancelarReserva(codigoReserva, vueloId) {
  const token = localStorage.getItem('token');

  if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

  try {
    const res = await fetch(`/api/tuvuelo/cancelar/${codigoReserva}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.mensaje || '❌ Error al cancelar la reserva.');
      return;
    }

    const reciboHTML = `
      <h3>✈️ Reserva Cancelada</h3>
      <p><strong>Reserva:</strong> ${codigoReserva}</p>
      <p><strong>Vuelo:</strong> ${vueloId}</p>
      <p><strong>Total pagado:</strong> $${data.total}</p>
      <p><strong>Reembolso (75%):</strong> $${data.reembolso}</p>
      <p>💳 Se devolverá a la tarjeta terminada en <strong>${data.ultimos4 || '****'}</strong></p>
    `;

    document.getElementById('contenidoRecibo').innerHTML = reciboHTML;
    document.getElementById('modalRecibo').style.display = 'block';

  } catch (error) {
    console.error(error);
    alert('❌ Error inesperado al cancelar la reserva.');
  }
}

// 🔄 Nueva función: cambiar fecha
function cambiarFecha(codigoReserva, origen, destino, vueloIdActual) {
  const url = `/cambiarFecha.html?reserva=${codigoReserva}&origen=${origen}&destino=${destino}&vueloActual=${vueloIdActual}`;
  window.location.href = url;
}

// Modal: cerrar ventana emergente cuando se haga click
document.addEventListener('click', () => {
  const modal = document.getElementById('modalRecibo');
  if (modal && modal.style.display === 'block') {
    modal.style.display = 'none';
    window.location.reload();
  }
});
