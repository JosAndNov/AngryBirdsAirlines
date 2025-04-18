const sequelize = require('./config/db');
const { Vuelo } = require('./models');

async function generarNuevoIdVuelo() {
  const ultimoVuelo = await Vuelo.findOne({
    order: [['createdAt', 'DESC']]
  });

  let nuevoNumero = 1;
  if (ultimoVuelo && ultimoVuelo.id) {
    const numeroAnterior = parseInt(ultimoVuelo.id.replace('ABA', ''));
    nuevoNumero = numeroAnterior + 1;
  }

  return `ABA${nuevoNumero.toString().padStart(4, '0')}`;
}

async function cargarVuelos() {
  await sequelize.sync();

  const vuelos = [
    {
      origen: 'Bogotá',
      destino: 'Cali',
      fechaSalida: '2025-05-27',
      horaSalida: '01:00',
      duracion: '1h',
      precio: 150000,
      capacidad: 5
    },
  ];

  for (const vueloData of vuelos) {
    try {
      const nuevoId = await generarNuevoIdVuelo();

      const vuelo = await Vuelo.create({
        id: nuevoId,
        ...vueloData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Vuelo ${vuelo.id} insertado correctamente`);
    } catch (error) {
      console.error('❌ Error al insertar vuelo:', error.message);
    }
  }

  await sequelize.close();
}

cargarVuelos();
