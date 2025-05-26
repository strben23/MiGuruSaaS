const amqp = require('amqplib');
const prompt = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function preguntar(pregunta) {
  return new Promise(resolve => {
    prompt.question(pregunta, respuesta => resolve(respuesta.trim()));
  });
}

async function publicarLogin() {
  const nombre = await preguntar('Nombre: ');
  const correo = await preguntar('Correo: ');
  const rol = await preguntar('Rol [estudiante, creador, administrador]: ');
  prompt.close();

  const datos = { nombre, correo, rol };

  const conn = await amqp.connect('amqps://tigresDelSoftware:passwordtemporal@computacion.mxl.uabc.mx:80');
  const canal = await conn.createChannel();

  await canal.assertExchange('loginUsuario', 'fanout', { durable: true });

  const mensaje = Buffer.from(JSON.stringify(datos));

  canal.publish('loginUsuario', '', mensaje, { persistent: true });

  console.log('🛂 Mensaje de autenticación enviado:', datos);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
}

publicarLogin().catch(console.error);
