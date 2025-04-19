const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_GMAIL,
    pass: process.env.CLAVE_APP
  }
});

const enviarCorreo = async (destinatario, asunto, html) => {
  try {
    await transporter.sendMail({
      from: `"Angry Birds Airlines 🐦" <${process.env.CORREO_EMISOR}>`,
      to: destinatario,
      subject: asunto,
      html
    });
    console.log('✅ Correo enviado a', destinatario);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
};

module.exports = enviarCorreo;
