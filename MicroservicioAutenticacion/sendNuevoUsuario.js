const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const JWT_SECRET = 'claveSecreta';
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'UsuariosMiGuru';

async function main() {
  const mongo = new MongoClient(MONGO_URL);
  await mongo.connect();
  const db = mongo.db(DB_NAME);
  const coleccion = db.collection('usuarios');

  const conn = await amqp.connect("amqps://tigresDelSoftware:passwordtemporal@computacion.mxl.uabc.mx:80");
  const canal = await conn.createChannel();

  await canal.assertExchange("nuevoUsuario", "fanout", { durable: true });
  const q = await canal.assertQueue("", { exclusive: true });
  canal.bindQueue(q.queue, "nuevoUsuario", "");

  console.log("📥 Esperando mensajes en exchange 'nuevoUsuario'...");

  canal.consume(q.queue, async (msg) => {
    if (msg.content) {
      try {
        const token = msg.content.toString();
        const datos = jwt.verify(token, JWT_SECRET);

        // Guarda en MongoDB
        await coleccion.insertOne(datos);
        console.log("✅ Usuario guardado en DB:", datos);
      } catch (e) {
        console.error("❌ Error procesando mensaje:", e.message);
      }
    }
  }, { noAck: true });
}

main().catch(console.error);
