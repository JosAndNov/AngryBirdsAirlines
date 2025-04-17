const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/db');

// Importamos el modelo
const { Usuario, Vuelo, Reserva, Promocion, Notificacion } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


//rutas
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const vueloRoutes = require('./routes/vuelos');
app.use('/api', vueloRoutes);

const ofertasRoutes = require('./routes/ofertas');
app.use('/api', ofertasRoutes);
  
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conectamos y sincronizamos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida con éxito');

    // Sincronizamos modelos (crea la tabla si no existe)
    return sequelize.sync({ alter: true }); // alter = actualiza si hay cambios
  })
  .then(() => {
    console.log('✅ Modelos sincronizados correctamente');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });

