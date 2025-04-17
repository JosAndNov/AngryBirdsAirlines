const express = require('express');
const { Vuelo, Reserva } = require('../models');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// 🔍 Buscar vuelos por origen, destino y fecha exacta
router.get('/vuelos', async (req, res) => {
  const { origen, destino, fecha } = req.query;

  try {
    const vuelos = await Vuelo.findAll({
      where: {
        origen,
        destino,
        fechaSalida: fecha
      }
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
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }

    // Buscar promoción si existe
    const { Promocion } = require('../models');
    const promo = await Promocion.findOne({
      where: { vueloId: vuelo.id }
    });

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


// ✈️ Reservar vuelo (requiere token)
router.post('/reservar', verificarToken, async (req, res) => {
  const { vueloId } = req.body;
  const usuarioId = req.usuario.id;

  try {
    const vuelo = await Vuelo.findByPk(vueloId);
    if (!vuelo) {
      return res.status(404).json({ mensaje: 'Vuelo no encontrado' });
    }

    // Contar reservas activas para este vuelo
    const reservas = await Reserva.count({
      where: { VueloId: vueloId, estado: 'activo' }
    });

    // Validar capacidad
    if (reservas >= vuelo.capacidad) {
      return res.status(400).json({ mensaje: 'Este vuelo ya está lleno' });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      UsuarioId: usuarioId,
      VueloId: vueloId,
      estado: 'activo'
    });

    res.status(201).json({
      mensaje: 'Reserva realizada con éxito',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la reserva' });
  }
});

module.exports = router;

