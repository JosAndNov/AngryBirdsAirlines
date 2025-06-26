# ✈️ Angry Birds Airlines

**Sistema completo de gestión de reservas de vuelos** para la aerolínea Angry Birds Airlines, desarrollado con Node.js, Express, PostgreSQL y Sequelize, utilizando una arquitectura MVC limpia y modular.

---

## 📦 Tecnologías utilizadas

- **Node.js** – Entorno de ejecución para JavaScript del lado del servidor.
- **Express.js** – Framework para manejar rutas, middleware y API REST.
- **PostgreSQL** – Base de datos relacional para almacenar toda la información.
- **Sequelize** – ORM para mapear objetos JavaScript a tablas relacionales.
- **Nodemailer** – Para enviar correos de confirmación y notificaciones.
- **dotenv** – Para manejar variables de entorno de forma segura.
- **bcrypt** – Para hashear contraseñas de usuarios.
- **HTML + CSS + JS Vanilla** – Frontend estático con diseño personalizado.

---

## 📁 Estructura del proyecto

```
Angry Birds Airlines/
│
├── config/              # Configuración de Sequelize y conexión a BD
├── controllers/         # (Opcional) si se usa lógica separada
├── models/              # Modelos Sequelize (Usuario, Vuelo, Reserva, etc.)
├── public/              # Archivos públicos (HTML, CSS, JS, imágenes)
│   ├── css/
│   ├── js/
│   └── img/
├── routes/              # Definición de rutas del servidor
├── utils/               # Funciones reutilizables (correo, validaciones, etc.)
├── .env                 # Variables de entorno
├── package.json         # Dependencias y scripts
└── index.js             # Archivo principal del servidor
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/angry-birds-airlines.git
cd angry-birds-airlines
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE vuelos_db;
```

### 4. Configurar el archivo `.env`

```env
PORT=3000
DB_NAME=vuelos_db
DB_USER=postgres
DB_PASSWORD=Vikingo2#88
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=claveSuperSecreta123
CORREO_EMISOR=angrybirdsairlines@gmail.com
CLAVE_CORREO="Angry2025"
CORREO_GMAIL=angrybirdsairlines@gmail.com
CLAVE_APP=bkmnextxwhwjakhr
```

### 5. Sincronizar base de datos

```bash
node index.js
```

---

## 🚀 Ejecutar el servidor

```bash
npm start
```

Accede desde: [http://localhost:3000](http://localhost:3000)

---

## ✅ Funcionalidades

### Usuario
- Registro y login con token JWT.
- Contraseña segura con hash `bcrypt`.

### Vuelos
- Búsqueda de vuelos por origen, destino y fecha.
- Visualización de resultados con tickets estilizados.

### Reservas
- Crear reserva para uno o varios pasajeros.
- Modificar o cancelar reservas.
- Cambiar la fecha de vuelo.
- Cálculo automático de diferencia de precio.

### Ofertas
- Sección de ofertas activas.
- Muestra descuentos aplicados y precios actualizados.
- Envío de notificaciones por correo.

### Correos
- Envío automático de confirmaciones y promociones por `nodemailer`.

---

## 🎨 Interfaz

- Estilo tipo boleto aéreo.
- Completamente en CSS personalizado.
- Responsive y visualmente atractivo.

---

## 🧠 Arquitectura técnica

- **models/**: Definición de entidades de la base de datos.
- **routes/**: Rutas agrupadas por función (usuarios, vuelos, reservas).
- **utils/**: Módulo de envío de correos y otras funciones comunes.
- **config/**: Configuración de Sequelize y conexión.

---

## 👨‍💻 Autor

Desarrollado por **Jostin Novoa** para Angry Birds Airlines - 2025.