#!/usr/bin/env node
/**
 * Script para crear automáticamente un curso completo basado en un título usando DeepSeek
 * Conecta con la API para generar el contenido del curso
 * Versión simplificada sin transacciones para garantizar compatibilidad con MongoDB standalone
 */
// --- START OF FILE crearCurso.js ---
/**
 * Script para crear automáticamente un curso completo basado en un título usando DeepSeek
 * Conecta con la API para generar el contenido del curso
 * Versión simplificada sin transacciones para garantizar compatibilidad con MongoDB standalone
 */
const path = require('path');
const dotenvPath = path.resolve(process.cwd(), '.env');
require('dotenv').config({ path: dotenvPath });
const readline = require('readline');
const mongoose = require('mongoose');
const { connectDB } = require('./utils/database'); // Asegúrate que esta ruta sea correcta
const { Curso, Leccion, Quiz, Creador } = require('./models');
const aiService = require('./services/ai.service');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Función principal que ejecuta el flujo completo de creación de curso
 * @param {string} tituloCurso - El título del curso.
 * @param {string[]} [leccionesInicialesTitulos] - Array opcional con los títulos de las 3 primeras lecciones.
 */
async function ejecutarCreacionCurso(tituloCurso, leccionesInicialesTitulos = []) { // <-- MODIFICADO
  try {
    await connectDB();
    console.log('✅ Conexión a MongoDB establecida');

    console.log(`\n📚 Generando curso: "${tituloCurso}"`);
    if (leccionesInicialesTitulos.length > 0) {
      console.log('📝 Con los siguientes títulos de lecciones iniciales:');
      leccionesInicialesTitulos.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));
    }
    
    console.log('🧠 Consultando a la IA para generar contenido...');
    console.log('⏳ Este proceso puede tardar unos segundos...\n');
    
    // Pasar los títulos de las lecciones iniciales al servicio de IA
    const contenidoGenerado = await aiService.generarContenidoCurso(tituloCurso, leccionesInicialesTitulos); // <-- MODIFICADO
    
    console.log('✅ Contenido generado por IA exitosamente\n');
    mostrarResumenContenido(contenidoGenerado);
    
    // Para uso programático (API), la confirmación se maneja externamente o se asume.
    // const confirmacion = await confirmarCreacion(); 
    // if (!confirmacion) {
    //   console.log('❌ Operación cancelada por el usuario.');
    //   process.exit(0); // O retornar un indicador de cancelación
    // }
    
    await crearDocumentos(contenidoGenerado);

    console.log('\n✅ ¡Curso creado exitosamente en la base de datos!');
    // No cerramos rl aquí si se va a llamar desde otro módulo (API)
    // rl.close(); 
    // process.exit(0); // No salir si se llama desde API
    return { success: true, message: "Curso creado exitosamente", cursoId: contenidoGenerado.curso._id }; // <-- MODIFICADO: retornar algo útil
  } catch (error) {
    console.error('\n❌ Error durante la creación del curso:', error.message);
    // No cerramos rl aquí
    // rl.close();
    // process.exit(1); // No salir si se llama desde API
    throw error; // Relanzar para que el llamador (API) lo maneje
  }
}

// Funciones de CLI (preguntarTituloCurso, confirmarCreacion) pueden mantenerse si se usa como script standalone
// pero si se usa principalmente como módulo, podrían ser opcionales o refactorizadas.

function preguntarTituloCurso() {
  return new Promise((resolve) => {
    rl.question('📝 Ingrese el título del curso a generar: ', (titulo) => {
      if (!titulo || titulo.trim() === '') {
        console.log('❌ El título no puede estar vacío. Por favor, intente de nuevo.');
        return preguntarTituloCurso().then(resolve);
      }
      resolve(titulo.trim());
    });
  });
}

// Nueva función para preguntar por las lecciones si se usa como CLI
async function preguntarLeccionesIniciales() {
  const lecciones = [];
  for (let i = 0; i < 3; i++) {
    const tituloLeccion = await new Promise(resolve => {
      rl.question(`📝 Ingrese el título para la lección inicial ${i + 1} (opcional, presione Enter para omitir): `, resolve);
    });
    if (tituloLeccion.trim()) {
      lecciones.push(tituloLeccion.trim());
    } else {
      // Si el usuario presiona enter sin texto, podemos decidir si pedir menos o simplemente parar.
      // Por simplicidad, si una se omite, las siguientes también se podrían omitir.
      // O, podrías pedir las 3 y solo usar las que tengan texto.
    }
  }
  // Filtrar vacíos por si el usuario solo dio Enter
  return lecciones.filter(t => t.length > 0);
}


function confirmarCreacion() {
  return new Promise((resolve) => {
    rl.question('\n❓ ¿Desea crear este curso en la base de datos? (s/n): ', (respuesta) => {
      const confirmado = respuesta.toLowerCase() === 's' || respuesta.toLowerCase() === 'si';
      resolve(confirmado);
    });
  });
}

function mostrarResumenContenido(contenido) {
  // (Sin cambios en esta función)
  console.log('📋 RESUMEN DEL CURSO GENERADO:');
  console.log('═════════════════════════════\n');
  console.log(`📚 Título: ${contenido.curso.titulo}`);
  console.log(`📝 Descripción: ${contenido.curso.descripcion}`);
  console.log(`⏱️  Duración: ${contenido.curso.duracionHoras}`);
  console.log(`👤 Creador: ${contenido.creador.nombre}`);
  console.log(`\n📔 Lecciones (${contenido.lecciones.length}):`);
  contenido.lecciones.forEach((leccion, index) => {
    console.log(`   ${index + 1}. ${leccion.titulo} (${leccion.contenido.video.duracion})`);
    console.log(`      📹 Video: ${leccion.contenido.video.url.substring(0, 50) + (leccion.contenido.video.url.length > 50 ? '...' : '')}`);
    console.log(`      📄 Recursos: ${leccion.contenido.recursos.length}`);
  });
  console.log(`\n❓ Quizzes (${contenido.quizzes.length}):`);
  contenido.quizzes.forEach((quiz, index) => {
    console.log(`   ${index + 1}. ${quiz.titulo} - ${quiz.preguntas.length} preguntas`);
  });
}

async function crearDocumentos(contenido) {
  // (Sin cambios significativos aquí, pero asegúrate que el ID del curso se guarde en contenido.curso._id para el retorno)
  try {
    console.log('\n🔄 Creando registros en la base de datos...');
    let creador = await Creador.findOne({ nombre: contenido.creador.nombre });
    if (!creador) {
      console.log(`👤 Creando nuevo creador: ${contenido.creador.nombre}`);
      creador = new Creador({
        nombre: contenido.creador.nombre,
        autenticado: contenido.creador.autenticado,
        cursos: []
      });
      await creador.save();
    }
    
    console.log(`📚 Creando curso: ${contenido.curso.titulo}`);
    const curso = new Curso({
      titulo: contenido.curso.titulo,
      descripcion: contenido.curso.descripcion,
      duracionHoras: contenido.curso.duracionHoras,
      publicado: contenido.curso.publicado || false,
      fechaCreacion: new Date(),
      // creador: creador._id, // Asegúrate que el modelo Curso tenga el campo 'creador'
      lecciones: [],
      quizzes: []
    });
    // Si el modelo Curso tiene un campo 'creador', asígnalo:
    if (curso.schema.paths.creador) {
         curso.creador = creador._id;
    }
    await curso.save();
    contenido.curso._id = curso._id; // Guardar el ID para el retorno

    console.log(`📔 Creando ${contenido.lecciones.length} lecciones...`);
    for (const [index, leccionData] of contenido.lecciones.entries()) {
      const leccion = new Leccion({
        titulo: leccionData.titulo,
        contenido: {
          video: {
            url: leccionData.contenido.video.url,
            duracion: leccionData.contenido.video.duracion
          },
          texto: leccionData.contenido.texto,
          recursos: leccionData.contenido.recursos.map(recurso => ({
            nombre: recurso.nombre,
            tipo: recurso.tipo,
            url: recurso.url
          }))
        },
        curso: curso._id,
        orden: leccionData.orden || index + 1
      });
      await leccion.save();
      curso.lecciones.push(leccion._id);
    }
    
    await Curso.findByIdAndUpdate(curso._id, { lecciones: curso.lecciones });
    
    console.log(`❓ Creando ${contenido.quizzes.length} quizzes...`);
    for (const quizData of contenido.quizzes) {
      if (!quizData.preguntas || !quizData.respuestas) {
        console.warn(`⚠️ Quiz "${quizData.titulo}" con datos faltantes. Saltando...`);
        continue;
      }
      if (quizData.preguntas.length !== quizData.respuestas.length) {
        console.warn(`⚠️ El quiz "${quizData.titulo}" tiene un número diferente de preguntas y respuestas. Ajustando...`);
        const minLength = Math.min(quizData.preguntas.length, quizData.respuestas.length);
        quizData.preguntas = quizData.preguntas.slice(0, minLength);
        quizData.respuestas = quizData.respuestas.slice(0, minLength);
      }
      if (quizData.preguntas.length === 0) {
        console.warn(`⚠️ Quiz "${quizData.titulo}" sin preguntas. Saltando...`);
        continue;
      }
      const quiz = new Quiz({
        titulo: quizData.titulo,
        preguntas: quizData.preguntas,
        respuestas: quizData.respuestas,
        calificacion: 0,
        curso: curso._id
      });
      await quiz.save();
      curso.quizzes.push(quiz._id);
    }
    
    await Curso.findByIdAndUpdate(curso._id, { quizzes: curso.quizzes });
    
    // Actualizar el creador con la referencia al nuevo curso
    creador.cursos.push(curso._id);
    await Creador.findByIdAndUpdate(creador._id, { cursos: creador.cursos });
    
    console.log('✅ Todos los registros fueron creados correctamente');
  } catch (error) {
    console.error('❌ Error al crear los documentos:', error.message);
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`- Campo ${field}: ${error.errors[field].message}`);
      }
    }
    throw error;
  }
}

// Para ejecutar como script standalone:
async function main() {
  if (require.main === module) { // Solo se ejecuta si es el script principal
    try {
      const tituloCurso = await preguntarTituloCurso();
      const leccionesTitulos = await preguntarLeccionesIniciales(); // Preguntar por lecciones
      
      const confirmacion = await confirmarCreacion();
      if (!confirmacion) {
        console.log('❌ Operación cancelada por el usuario.');
        process.exit(0);
      }

      await ejecutarCreacionCurso(tituloCurso, leccionesTitulos); // Pasar lecciones
    } catch (error) {
      // El error ya se maneja en ejecutarCreacionCurso
    } finally {
      rl.close();
      // Mongoose connection should be closed gracefully if opened by connectDB
      // Consider adding mongoose.disconnect() in connectDB's error/finally or here.
       if (mongoose.connection.readyState === 1) { // 1 === connected
         await mongoose.disconnect();
         console.log("🔌 Conexión a MongoDB cerrada.");
       }
      process.exit(error ? 1 : 0);
    }
  }
}

// main(); // Descomenta si quieres ejecutarlo directamente

module.exports = {
  ejecutarCreacionCurso // Exportar para usar en la API
};
// --- END OF FILE crearCurso.js ---