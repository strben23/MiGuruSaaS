const express = require('express');
const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors()); // Por si accedes desde el frontend

const JWT_SECRET = 'claveSecreta';

// Definición del esquema y modelo de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  rol: String,
  idioma: String,
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

let canal = null;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost/usuariosDB',).then(() => {
  console.log('✅ Conectado a MongoDB');
}).catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err.message);
});

// Conexión a RabbitMQ
async function conectarRabbit() {
  try {
    const conn = await amqp.connect("amqps://tigresDelSoftware:passwordtemporal@computacion.mxl.uabc.mx:80");
    canal = await conn.createChannel();
    await canal.assertExchange("nuevoUsuario", "fanout", { durable: true });
    console.log("✅ Conectado a RabbitMQ y exchange 'nuevoUsuario'");
  } catch (err) {
    console.error("❌ Error conectando a RabbitMQ:", err.message);
  }
}
conectarRabbit();

// Ruta para registrar usuarios
app.post('/api/usuarios/nuevo', async (req, res) => {
  const { nombre, correo, rol, idioma } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nombre y correo)' });
  }

  try {
    // Verificar si ya existe un usuario con ese correo
    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // No existe, así que publicamos el mensaje a RabbitMQ
    const datosUsuario = {
      nombre,
      correo,
      rol: ['estudiante', 'creador', 'administrador'].includes(rol) ? rol : 'estudiante',
      idioma: ['es', 'en'].includes(idioma) ? idioma : 'es',
    };

    const token = jwt.sign(datosUsuario, JWT_SECRET, { algorithm: 'HS256', noTimestamp: true });

    canal.publish("nuevoUsuario", "", Buffer.from(token), { persistent: true });

    // Opcional: también puedes guardar aquí directamente si quieres
    // await Usuario.create(datosUsuario);

    console.log("[✔] Enviado nuevo usuario a RabbitMQ:", datosUsuario);
    res.status(200).json({ mensaje: 'Usuario enviado correctamente' });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para login de usuario
app.post('/api/usuarios/login', async (req, res) => {
  const { correo, nombre } = req.body;

  if (!correo || !nombre) {
    return res.status(400).json({ error: 'Se requieren nombre y correo' });
  }

  try {
    const usuario = await Usuario.findOne({ correo, nombre });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o correo incorrecto' });
    }

    const token = jwt.sign({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      idioma: usuario.idioma
    }, JWT_SECRET, { algorithm: 'HS256', noTimestamp: true });

    console.log("🔑 Login exitoso para:", correo);
    res.status(200).json({
      mensaje: `Login exitoso para: ${correo}`,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        idioma: usuario.idioma
      },
      token
    });
  } catch (err) {
    console.error("❌ Error al procesar login:", err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Servidor de registro en http://localhost:3001');
});