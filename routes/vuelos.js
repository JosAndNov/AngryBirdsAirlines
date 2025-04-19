const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { Vuelo, Reserva, Pasajero, Usuario, Promocion, Tarjeta } = require('../models');
const enviarCorreo = require('../utils/correo');

// 🔍 Buscar vuelos por origen, destino y fecha
router.get('/vuelos', async (req, res) => {
  const { origen, destino, fecha } = req.query;

  try {
    const vuelos = await Vuelo.findAll({
      where: { origen, destino, fechaSalida: fecha }
    });

    if (vuelos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron vuelos disponibles' });
    }

    res.status(200).json({ vuelos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar vuelos' });
  }
});

// 🔎 Obtener información de un vuelo por ID
router.get('/vuelos/:id', async (req, res) => {
  try {
    const vuelo = await Vuelo.findByPk(req.params.id);
    if (!vuelo) return res.status(404).json({ mensaje: 'Vuelo no encontrado' });

    const promo = await Promocion.findOne({ where: { vueloId: vuelo.id } });

    let precioFinal = parseFloat(vuelo.precio);
    let tienePromocion = false;
    let porcentaje = null;

    if (promo) {
      tienePromocion = true;
      porcentaje = promo.porcentaje;
      precioFinal = Math.round(precioFinal * (1 - porcentaje / 100));
    }

    res.status(200).json({
      vuelo: {
        id: vuelo.id,
        origen: vuelo.origen,
        destino: vuelo.destino,
        fechaSalida: vuelo.fechaSalida,
        horaSalida: vuelo.horaSalida,
        precioOriginal: vuelo.precio,
        precioFinal,
        tienePromocion,
        porcentajeDescuento: porcentaje
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar el vuelo' });
  }
});

// ✈️ Reservar vuelo
router.post('/reservar', verificarToken, async (req, res) => {
  try {
    const { vueloId, pasajeros, correoReserva, tarjeta } = req.body;
    const usuarioId = req.usuario.id;

    if (!correoReserva) {
      return res.status(400).json({ mensaje: 'El correo de la reserva es obligatorio.' });
    }    

    const vuelo = await Vuelo.findByPk(vueloId);
    if (!vuelo) return res.status(404).json({ mensaje: 'Vuelo no encontrado' });

    const reservasActuales = await Pasajero.count({ where: { VueloId: vueloId } });
    if (reservasActuales + pasajeros.length > vuelo.capacidad) {
      return res.status(400).json({ mensaje: 'No hay suficientes cupos disponibles' });
    }

    const totalReservas = await Reserva.count();
    const codigoReserva = `${vuelo.id}-${vuelo.origen.substring(0, 3)}-${(totalReservas + 1).toString().padStart(4, '0')}`;
    const usuario = await Usuario.findByPk(usuarioId);

    // Verificamos si tiene promoción
    const promo = await Promocion.findOne({ where: { vueloId } });
    const precioUnitario = promo ? Math.round(vuelo.precio * (1 - promo.porcentaje / 100)) : vuelo.precio;
    const total = precioUnitario * pasajeros.length;

    // Crear reserva
    const reserva = await Reserva.create({
      codigoReserva,
      correoUsuario: usuario.correo,
      correoReserva,
      titularReserva: `${pasajeros[0].nombre} ${pasajeros[0].apellido}`,
      cantidadPasajeros: pasajeros.length,
      total,
      VueloId: vueloId,
      UsuarioId: usuarioId,
      estado: 'activo'
    });

    // Guardar pasajeros
    for (const p of pasajeros) {
      await Pasajero.create({
        nombre: p.nombre,
        apellido: p.apellido,
        documento: p.documento,
        ReservaId: reserva.codigoReserva, // clave foránea personalizada
        VueloId: vueloId,
        codigoReserva
      });
    }

    // Guardar tarjeta
    await Tarjeta.create({
      numero: tarjeta.numeroTarjeta,
      vencimiento: tarjeta.vencimiento,
      cvv: tarjeta.cvv,
      codigoReserva
    });

    const htmlReserva = `
  <h2>🎟️ Comprobante de Reserva</h2>
  <p><strong>Reserva:</strong> ${codigoReserva}</p>
  <p><strong>Vuelo:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
  <p><strong>Fecha:</strong> ${vuelo.fechaSalida}</p>
  <p><strong>Hora:</strong> ${vuelo.horaSalida}</p>
  <p><strong>Total pagado:</strong> $${total}</p>
  <hr>
  <h4>Pasajeros:</h4>
  <ul>
    ${pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
  </ul>
  <p>✅ ¡Gracias por reservar con Angry Birds Airlines!</p>
  `;

  res.status(201).json({
    mensaje: 'Reserva realizada con éxito',
    reserva: {
      codigoReserva,
      correoUsuario: usuario.correo,
      titularReserva: `${pasajeros[0].nombre} ${pasajeros[0].apellido}`,
      total
    }
  }); 

  await enviarCorreo(
    correoReserva,
    '✈️ Confirmación de reserva - Angry Birds Airlines',
    `
      <h2>¡Reserva confirmada!</h2>
      <p>Gracias por reservar con Angry Birds Airlines.</p>
      <p><strong>Código de Reserva:</strong> ${codigoReserva}</p>
      <p><strong>Vuelo:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
      <p><strong>Fecha:</strong> ${vuelo.fechaSalida} a las ${vuelo.horaSalida}</p>
      <p><strong>Pasajeros:</strong></p>
      <ul>
        ${pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
      </ul>
      <p>🧾 Total pagado: $${total}</p>
      <hr>
      <p>Gracias por confiar en nosotros. ¡Buen vuelo! 🛫</p>
    `
  );
  

  } catch (error) {
    console.error('❌ Error al procesar la reserva:', error);
    res.status(500).json({ mensaje: 'Error al procesar la reserva' });
  }
});



module.exports = router;
