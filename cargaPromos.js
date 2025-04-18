const { Promocion } = require('./models');
const sequelize = require('./config/db');

async function cargarPromociones() {
  await sequelize.sync();

  const promociones = [
    {
      descripcion: 'Descuento por temporada baja',
      porcentaje: 20,
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-25',
      vueloId: 'ABA0040' // ← Cambia por un ID válido de vuelo
    },
    {
      descripcion: 'Promo especial por aniversario',
      porcentaje: 30,
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-10',
      vueloId: 'ABA0022'
    },
    {
      descripcion: 'Oferta exclusiva para estudiantes',
      porcentaje: 25,
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-10',
      vueloId: 'ABA0013'
    },
    {
        descripcion: 'Oferta exclusiva para porfesores',
        porcentaje: 25,
        fechaInicio: '2025-04-18',
        fechaFin: '2025-05-10',
        vueloId: 'ABA0044'
      }
  ];

  for (const promo of promociones) {
    await Promocion.create(promo);
  }

  console.log('✅ Promociones insertadas con éxito');
  process.exit();
}

cargarPromociones();
