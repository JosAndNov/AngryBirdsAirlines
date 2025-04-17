const express = require('express');
const router = express.Router();
const { Promocion, Vuelo } = require('../models');

router.get('/ofertas', async (req, res) => {
  try {
    const promociones = await Promocion.findAll({
      include: {
        model: Vuelo,
        required: true
      }
    });

    if (promociones.length === 0) {
      return res.status(404).json({ mensaje: 'No hay promociones activas' });
    }

    // Procesar los datos para el frontend
    const ofertas = promociones.map(promo => {
      const vuelo = promo.Vuelo;
      const precioOriginal = parseFloat(vuelo.precio);
      const descuento = promo.porcentaje;
      const precioDescuento = Math.round(precioOriginal * (1 - descuento / 100));

      return {
        id: promo.id,
        descripcion: promo.descripcion,
        porcentaje: descuento,
        precioOriginal,
        precioDescuento,
        vuelo: {
          id: vuelo.id,
          origen: vuelo.origen,
          destino: vuelo.destino,
          fechaSalida: vuelo.fechaSalida,
          horaSalida: vuelo.horaSalida
        }
      };
    });

    res.status(200).json({ ofertas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las ofertas' });
  }
});

module.exports = router;
