const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    // Validar si el usuario ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Cifrar contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contraseña: hash
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Login
// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    console.log('Contraseña recibida:', contraseña);
    console.log('Contraseña almacenada:', usuario.contraseña);

    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar también el nombre del usuario al frontend
    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


module.exports = router;
