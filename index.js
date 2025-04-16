const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando y esperando conexión con la base de datos');
});

// Aquí nos conectamos a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida con éxito');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });