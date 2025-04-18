const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { Reserva, Vuelo, Pasajero } = require('../models');

// 🔐 Obtener reservas activas del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const reservas = await Reserva.findAll({
      where: { UsuarioId: usuarioId, estado: 'activo' },
      include: [
        {
          model: Vuelo,
          as: 'vuelo'
        },
        {
          model: Pasajero,
          as: 'pasajeros'
        }
      ]
    });

    res.status(200).json({ reservas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cargar reservas' });
  }
});

module.exports = router;
