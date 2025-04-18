// resetDB.js
const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.drop(); // Borra todas las tablas
    console.log('🧨 Todas las tablas fueron eliminadas exitosamente');

    await sequelize.sync({ force: true }); // Las vuelve a crear
    console.log('✅ Tablas recreadas correctamente con los nuevos modelos');

    process.exit();
  } catch (error) {
    console.error('❌ Error al reiniciar la base de datos:', error);
    process.exit(1);
  }
})();
