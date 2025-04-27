const { Promocion, Vuelo, Usuario } = require('./models');
const sequelize = require('./config/db');
const enviarCorreo = require('./utils/correo'); 
const { Op } = require('sequelize');

async function cargarPromociones() {
  await sequelize.sync();

  const promociones = [
    {
      descripcion: 'Descuento por socio nuevo',
      porcentaje: 50,
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-25',
      vueloId: 'ABA0043' 
    }
  ];

  for (const promo of promociones) {
    const nuevaPromo = await Promocion.create(promo);

    // Buscar vuelo relacionado
    const vuelo = await Vuelo.findByPk(promo.vueloId);
    if (!vuelo) {
      console.error('❌ No se encontró el vuelo relacionado:', promo.vueloId);
      continue;
    }

    const precioOriginal = vuelo.precio;
    const precioDescuento = Math.round(precioOriginal * (1 - promo.porcentaje / 100));

    // Buscar usuarios que tengan correo
    const usuarios = await Usuario.findAll({
      where: { correo: { [Op.ne]: null } }
    });

    for (const usuario of usuarios) {
      await enviarCorreo(
        usuario.correo,
        `✈️ Nueva promoción disponible: ${promo.descripcion}`,
        `
          <h2>🎉 ¡Nueva promoción en Angry Birds Airlines!</h2>
          <p><strong>Motivo:</strong> ${promo.descripcion}</p>
          <p><strong>Origen:</strong> ${vuelo.origen}</p>
          <p><strong>Destino:</strong> ${vuelo.destino}</p>
          <p><strong>Código de Vuelo:</strong> ${vuelo.id}</p>
          <p><strong>Fecha de Salida:</strong> ${vuelo.fechaSalida}</p>
          <p><strong>Hora de Salida:</strong> ${vuelo.horaSalida}</p>
          <p><strong>Precio original:</strong> $${precioOriginal}</p>
          <p><strong>Precio con descuento:</strong> $${precioDescuento}</p>
          <p><strong>Válido desde:</strong> ${promo.fechaInicio} hasta ${promo.fechaFin}</p>
          <hr>
          <p>🚀 Entra a Angry Birds Airlines para reservar tu vuelo desde la sección <strong>Ofertas</strong>.</p>
        `
      );
    }
  }

  console.log('✅ Promociones insertadas y correos enviados.');
  process.exit();
}

cargarPromociones();
