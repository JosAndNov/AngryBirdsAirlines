window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const codigoReserva = new URLSearchParams(window.location.search).get('reserva');
  
    if (!token || !codigoReserva) {
      alert('Debe iniciar sesión y proporcionar un código de reserva válido');
      window.location.href = '/login.html';
      return;
    }
  
    try {
      const res = await fetch(`/api/tuvuelo/detalle/${codigoReserva}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        document.getElementById('mensaje').innerText = data.mensaje;
        return;
      }
  
      const { reserva } = data;
      const pasajerosContainer = document.getElementById('pasajerosContainer');
  
      document.getElementById('infoReserva').innerHTML = `
        <h3>Reserva #${reserva.codigoReserva} - Vuelo ${reserva.vuelo.id}</h3>
        <p><strong>Ruta:</strong> ${reserva.vuelo.origen} → ${reserva.vuelo.destino}</p>
        <p><strong>Fecha:</strong> ${reserva.vuelo.fechaSalida}</p>
        <p><strong>Hora:</strong> ${reserva.vuelo.horaSalida}</p>
        <p><strong>Correo actual:</strong> ${reserva.correoReserva}</p>
        <label for="nuevoCorreo">Nuevo correo para la reserva:</label><br>
        <input type="email" id="nuevoCorreo" value="${reserva.correoReserva}" required><br><br>
        <hr>
      `;
  
      // Mostrar todos los pasajeros con campos editables
      reserva.pasajeros.forEach((p, i) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h4>Pasajero ${i + 1}</h4>
          <input type="text" value="${p.nombre}" placeholder="Nombre" class="nombreMod" data-id="${p.id}" required><br>
          <input type="text" value="${p.apellido}" placeholder="Apellido" class="apellidoMod" data-id="${p.id}" required><br>
          <input type="text" value="${p.documento}" placeholder="Documento" class="documentoMod" data-id="${p.id}" required><br><br>
        `;
        pasajerosContainer.appendChild(div);
      });
  
      // Enviar cambios
      document.getElementById('formModificar').addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const nombres = [...document.querySelectorAll('.nombreMod')].map(el => ({ id: el.dataset.id, valor: el.value }));
        const apellidos = [...document.querySelectorAll('.apellidoMod')].map(el => ({ id: el.dataset.id, valor: el.value }));
        const documentos = [...document.querySelectorAll('.documentoMod')].map(el => ({ id: el.dataset.id, valor: el.value }));
        const nuevoCorreo = document.getElementById('nuevoCorreo').value;
  
        const pasajerosMod = nombres.map((n, i) => ({
          id: n.id,
          nombre: n.valor,
          apellido: apellidos[i].valor,
          documento: documentos[i].valor
        }));
  
        const resMod = await fetch(`/api/tuvuelo/modificar/${codigoReserva}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ pasajeros: pasajerosMod, correoReserva: nuevoCorreo })
        });
  
        const resultado = await resMod.json();
  
        if (resMod.ok) {
            document.getElementById('contenidoConfirmacion').innerHTML = `
            <h3>✏️ Reserva modificada con éxito</h3>
            <p><strong>Reserva:</strong> ${codigoReserva}</p>
            <p><strong>Vuelo:</strong> ${reserva.vuelo.origen} → ${reserva.vuelo.destino}</p>
            <p><strong>Fecha:</strong> ${reserva.vuelo.fechaSalida} a las ${reserva.vuelo.horaSalida}</p>
            <p><strong>Nuevo correo:</strong> ${nuevoCorreo}</p>
            <h4>🧍 Pasajeros actualizados:</h4>
            <ul>
              ${pasajerosMod.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
            </ul>
            <button onclick="window.location.href='/tuvuelo.html'">Volver</button>
          `;          
          document.getElementById('modalConfirmacion').style.display = 'block';
        } else {
          alert(resultado.mensaje || '❌ No se pudo modificar la reserva.');
        }
      });
  
    } catch (err) {
      console.error(err);
      document.getElementById('mensaje').innerText = 'Error al cargar la reserva.';
    }
  });
  
  