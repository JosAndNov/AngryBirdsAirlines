const cantidadInput = document.getElementById('cantidad');
const pasajerosContainer = document.getElementById('pasajerosContainer');
let vuelo = null; // Se asignará al cargar el vuelo

function generarFormularios(cantidad) {
  pasajerosContainer.innerHTML = '';
  for (let i = 2; i <= cantidad; i++) {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>Pasajero ${i}</h4>
      <input type="text" placeholder="Nombre" required class="nombreExtra"><br>
      <input type="text" placeholder="Apellido" required class="apellidoExtra"><br>
      <input type="text" placeholder="Documento" required class="documentoExtra"><br><br>
    `;
    pasajerosContainer.appendChild(div);
  }

  // Mostrar el total actualizado
  mostrarTotal();
}

function mostrarTotal() {
  const cant = parseInt(cantidadInput.value);
  if (!vuelo || isNaN(cant)) return;

  const precio = vuelo.tienePromocion ? vuelo.precioFinal : vuelo.precioOriginal;
  const total = precio * cant;

  document.getElementById('totalPagar').innerHTML = `
    <p><strong>Total a pagar:</strong> $${total}</p>
  `;
}

cantidadInput.addEventListener('change', (e) => {
  const cant = parseInt(e.target.value);
  if (cant >= 1 && cant <= 5) {
    generarFormularios(cant);
  }
  mostrarTotal();
});

window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const vueloId = new URLSearchParams(window.location.search).get('vuelo');

  if (!token) {
    alert('Debes iniciar sesión para reservar');
    window.location.href = '/login.html';
    return;
  }

  const infoVuelo = document.getElementById('infoVuelo');

  const res = await fetch(`/api/vuelos/${vueloId}`);
  const data = await res.json();

  if (!res.ok) {
    infoVuelo.innerText = '❌ Vuelo no encontrado';
    return;
  }

  vuelo = data.vuelo;

  infoVuelo.innerHTML = `
    <h3>Reserva para el vuelo #${vuelo.id}</h3>
    <p>Ruta: ${vuelo.origen} → ${vuelo.destino}</p>
    <p>Fecha de salida: ${vuelo.fechaSalida}</p>
    <p>Hora de salida: ${vuelo.horaSalida}</p>
    ${
      vuelo.tienePromocion
        ? `<p>Precio original: <s>$${vuelo.precioOriginal}</s></p>
           <p><strong>Precio con descuento: $${vuelo.precioFinal}</strong> (${vuelo.porcentajeDescuento}% OFF)</p>`
        : `<p>Precio: $${vuelo.precioOriginal}</p>`
    }
    <p><strong>Capacidad disponible:</strong> se verificará al confirmar reserva</p>
    <div id="totalPagar"></div>
    <hr>
  `;

  mostrarTotal();

  const form = document.getElementById('formReserva');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const documento = document.getElementById('documento').value;

    const nombresExtras = [...document.querySelectorAll('.nombreExtra')].map(el => el.value);
    const apellidosExtras = [...document.querySelectorAll('.apellidoExtra')].map(el => el.value);
    const documentosExtras = [...document.querySelectorAll('.documentoExtra')].map(el => el.value);

    if (nombresExtras.includes('') || apellidosExtras.includes('') || documentosExtras.includes('')) {
      alert('Por favor completa todos los datos de los pasajeros adicionales.');
      return;
    }

    const pasajeros = [
      { nombre, apellido, documento },
      ...nombresExtras.map((n, i) => ({
        nombre: n,
        apellido: apellidosExtras[i],
        documento: documentosExtras[i]
      }))
    ];

    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value;

    // Validación de tarjeta
    if (!/^\d{16}$/.test(numeroTarjeta)) {
      alert('El número de tarjeta debe tener exactamente 16 dígitos.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
      alert('El formato del vencimiento debe ser MM/YY.');
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      alert('El CVV debe tener exactamente 3 dígitos.');
      return;
    }

    const resReserva = await fetch('/api/reservar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vueloId,
        pasajeros,
        correoReserva: correo,
        tarjeta: { numeroTarjeta, vencimiento, cvv }
      })
    });

    const result = await resReserva.json();

    if (resReserva.ok) {
      const codigoReserva = result.reserva.codigoReserva;
      const total = (vuelo.tienePromocion ? vuelo.precioFinal : vuelo.precioOriginal) * pasajeros.length;

      const reciboHTML = `
        <h3>🎟️ Comprobante de Reserva</h3>
        <p><strong>Vuelo #${vuelo.id}</strong></p>
        <p><strong>Código de Reserva:</strong> ${codigoReserva}</p>
        <p><strong>Ruta:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
        <p><strong>Fecha:</strong> ${vuelo.fechaSalida}</p>
        <p><strong>Hora:</strong> ${vuelo.horaSalida}</p>
        <p><strong>Total pagado:</strong> $${total}</p>
        <hr>
        <h4>Pasajeros:</h4>
        <ul>
          ${pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
        </ul>
        <p>✅ ¡Reserva exitosa!</p>
      `;
      document.getElementById('contenidoRecibo').innerHTML = reciboHTML;
      document.getElementById('modalRecibo').style.display = 'block';
    } else {
      alert(result.mensaje || '❌ No se pudo completar la reserva.');
      document.getElementById('mensaje').innerText = `❌ ${result.mensaje || 'Error al procesar la reserva'}`;
    }
  });
});

document.addEventListener('click', () => {
  const modal = document.getElementById('modalRecibo');
  if (modal.style.display === 'block') {
    modal.style.display = 'none';
    window.location.href = '/inicio.html';
  }
});
