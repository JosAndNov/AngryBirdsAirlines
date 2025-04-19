const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { Reserva, Pasajero, Vuelo } = require('../models');
const enviarCorreo = require('../config/correo');

// PUT /api/modificar/:codigoReserva
router.put('/:codigoReserva', verificarToken, async (req, res) => {
    const { codigoReserva } = req.params;
    const nuevosPasajeros = req.body.pasajeros;
    const nuevoCorreoReserva = req.body.correoReserva;
  
    try {
      const reserva = await Reserva.findOne({ where: { codigoReserva } });
      if (!reserva) {
        return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      }
  
      const vuelo = await Vuelo.findByPk(reserva.VueloId);
      const vueloFecha = new Date(`${vuelo.fechaSalida}T${vuelo.horaSalida}`);
      const ahora = new Date();
      const diferenciaHoras = (vueloFecha - ahora) / 1000 / 3600;
  
      if (diferenciaHoras < 48) {
        return res.status(400).json({ mensaje: '⛔ No se puede modificar la reserva con menos de 48 horas de anticipación.' });
      }
  
      const pasajerosExistentes = await Pasajero.findAll({
        where: { codigoReserva },
        order: [['id', 'ASC']]
      });
  
      if (pasajerosExistentes.length !== nuevosPasajeros.length) {
        return res.status(400).json({ mensaje: 'La cantidad de pasajeros no coincide.' });
      }
  
      for (let i = 0; i < pasajerosExistentes.length; i++) {
        pasajerosExistentes[i].nombre = nuevosPasajeros[i].nombre;
        pasajerosExistentes[i].apellido = nuevosPasajeros[i].apellido;
        pasajerosExistentes[i].documento = nuevosPasajeros[i].documento;
        await pasajerosExistentes[i].save();
      }
  
      // Si el correo cambió, actualizarlo
      if (nuevoCorreoReserva && nuevoCorreoReserva !== reserva.correoReserva) {
        reserva.correoReserva = nuevoCorreoReserva;
      }
  
      // También se actualiza el titular si el primer pasajero cambió
      reserva.titularReserva = `${nuevosPasajeros[0].nombre} ${nuevosPasajeros[0].apellido}`;
      await reserva.save();
  
      res.status(200).json({
        mensaje: '✏️ La reserva fue modificada correctamente.',
        nuevoTitular: reserva.titularReserva,
        nuevoCorreo: reserva.correoReserva
      });
      
      await enviarCorreo(
        reserva.correoReserva,
        '✏️ Modificación de reserva - Angry Birds Airlines',
        `
          <h2>✏️ Tu reserva ha sido modificada</h2>
          <p><strong>Código de Reserva:</strong> ${reserva.codigoReserva}</p>
          <p><strong>Vuelo:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
          <p><strong>Fecha:</strong> ${vuelo.fechaSalida} a las ${vuelo.horaSalida}</p>
          <p><strong>Nuevo titular:</strong> ${reserva.titularReserva}</p>
          <p><strong>Nuevo correo:</strong> ${reserva.correoReserva}</p>
          <hr>
          <p><strong>Pasajeros actualizados:</strong></p>
          <ul>
            ${nuevosPasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
          </ul>
          <p>🛫 ¡Gracias por actualizar tu información!</p>
        `
      );
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: '❌ Error al modificar la reserva.' });
    }
  });
  
  module.exports = router;
  
