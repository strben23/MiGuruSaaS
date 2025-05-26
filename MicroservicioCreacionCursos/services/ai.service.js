// --- START OF FILE services/ai.service.js ---

/**
 * Servicio para interactuar con la API de OpenAI
 */
require('dotenv').config();
const axios = require('axios');
const config = require('../config/openai.config');
const { model } = require('mongoose');

class AIService {
  constructor() {
    if (!config.apiKey) {
      throw new Error('No se encontró la API key de DeepSeek en las variables de entorno');
    }
  }

  /**
   * Genera el contenido completo de un curso basado en un título y lecciones iniciales
   * @param {string} tituloCurso - Título del curso a generar
   * @param {string[]} leccionesIniciales - Array con los títulos de las primeras 3 lecciones
   * @returns {Promise<Object>} - Objeto con la estructura del curso generado
   */
  async generarContenidoCurso(tituloCurso, leccionesIniciales = []) { // <-- MODIFICADO: Añadir leccionesIniciales
    try {
      console.log(`Solicitando a la IA generar contenido para: "${tituloCurso}" con lecciones iniciales...`);

      const prompt = this.construirPrompt(tituloCurso, leccionesIniciales); // <-- MODIFICADO: Pasar leccionesIniciales

      const response = await axios.post(
        `${config.baseURL}/chat/completions`,
        {
          model: config.model,
          messages: [
            {
              role: "system",
              content: "Eres un experto en educación y creación de cursos. Tu tarea es generar el contenido detallado de un curso educativo en formato JSON siguiendo la estructura que se te proporciona. IMPORTANTE: Proporciona solo el JSON puro sin marcadores de código como ```json o ```."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          }
        }
      );

      const choices = response.data.choices;
      if (!choices || choices.length === 0) {
        throw new Error('La respuesta de la IA no contiene datos válidos');
      }

      let content = choices[0].message.content;
      console.log('Respuesta de la IA:', content);

      content = this.limpiarContenidoJSON(content);

      const contenidoJson = JSON.parse(content);
      return this.validarEstructuraRespuesta(contenidoJson, leccionesIniciales); // <-- MODIFICADO: Opcional, pasar leccionesIniciales para validar
    } catch (error) {
      console.error('Error al generar contenido con la IA:', error.message);
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
      }
      throw new Error(`Error al generar el contenido del curso: ${error.message}`);
    }
  }

  limpiarContenidoJSON(contenido) {
    return contenido
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();
  }

  /**
   * Construye el prompt para la IA
   * @param {string} tituloCurso - Título del curso
   * @param {string[]} leccionesIniciales - Array con los títulos de las primeras 3 lecciones
   * @returns {string} - Prompt completo para la IA
   */
  construirPrompt(tituloCurso, leccionesIniciales = []) { // <-- MODIFICADO: Añadir leccionesIniciales
    let leccionesEspecificas = "";
    if (leccionesIniciales && leccionesIniciales.length > 0) {
      leccionesEspecificas = `
Comienza con las siguientes lecciones (usa estos títulos exactos para las primeras ${leccionesIniciales.length} lecciones y luego genera el resto):
${leccionesIniciales.map((titulo, index) => `  ${index + 1}. "${titulo}"`).join('\n    ')}
`;
    }

    return `
Genera el contenido completo para un curso titulado "${tituloCurso}".
${leccionesEspecificas} {/* <-- MODIFICADO: Insertar títulos de lecciones específicas aquí */}
Necesito que el resultado sea en formato JSON con la siguiente estructura:
{
  "curso": {
    "titulo": "Título del curso", // Asegúrate que coincida con "${tituloCurso}"
    "descripcion": "Descripción detallada del curso",
    "duracionHoras": "10:30", // Estimación total
    "publicado": false
  },
  "creador": {
    "nombre": "Nombre del creador", // Puedes inventar uno o usar "Profesor AI"
    "autenticado": true
  },
  "lecciones": [
    {
      "titulo": "Título de la lección 1", // Si se proporcionaron títulos, usar el primero aquí
      "contenido": {
        "video": {
          "url": "URL del video (placeholder o ejemplo)",
          "duracion": "10:15" // Duración estimada de la lección
        },
        "texto": "Contenido textual detallado de la lección. Debe ser extenso y útil.",
        "recursos": [
          {
            "nombre": "Nombre del recurso (ej. Guía PDF, Enlace externo)",
            "tipo": "pdf", // o 'link', 'documento'
            "url": "URL del recurso (placeholder o ejemplo)"
          }
        ]
      },
      "orden": 1
    }
    // Incluye un total de al menos 5 lecciones. Si se proporcionaron N lecciones iniciales, genera al menos 5-N lecciones adicionales.
  ],
  "quizzes": [
    {
      "titulo": "Quiz de evaluación para el curso",
      "preguntas": [
        "¿Pregunta 1 relacionada al contenido del curso?",
        "¿Pregunta 2 relacionada al contenido del curso?",
        "¿Pregunta 3 relacionada al contenido del curso?"
      ],
      "respuestas": [ // Proporciona respuestas correctas para las preguntas
        "Respuesta correcta 1",
        "Respuesta correcta 2",
        "Respuesta correcta 3"
      ]
    }
    // Incluye al menos 2 quizzes relevantes para el curso.
  ]
}

Asegúrate de que:
1. El contenido sea educativo y relevante para el título y las lecciones iniciales proporcionadas.
2. Las lecciones tengan un orden lógico y progresivo. Las primeras lecciones deben usar los títulos que te he dado.
3. Cada lección tenga contenido textual extenso y detallado, y al menos un recurso real o plausible.
4. Los quizzes tengan el mismo número de preguntas y respuestas, y estas sean coherentes.
5. Las URLs referenciadas pueden ser placeholders como "https://ejemplo.com/video.mp4" o "https://ejemplo.com/recurso.pdf", pero deben lucir como URLs válidas.
6. La duración esté en formato "horas:minutos".

Genera un curso completo con un total de al menos 5 lecciones (utilizando los títulos iniciales proporcionados para las primeras) y al menos 2 quizzes.
`;
  }

  /**
   * Valida que la estructura de la respuesta sea correcta
   * @param {Object} respuesta - Respuesta de la IA
   * @param {string[]} [leccionesEsperadas] - Títulos de lecciones iniciales esperadas (opcional)
   * @returns {Object} - Respuesta validada
   */
  validarEstructuraRespuesta(respuesta, leccionesEsperadas = []) { // <-- MODIFICADO: Añadir leccionesEsperadas
    if (!respuesta.curso || !respuesta.creador ||
      !respuesta.lecciones || !respuesta.quizzes) {
      throw new Error('La estructura de la respuesta no es válida: faltan claves principales (curso, creador, lecciones, quizzes).');
    }

    if (!Array.isArray(respuesta.lecciones) || respuesta.lecciones.length < (leccionesEsperadas.length > 0 ? leccionesEsperadas.length : 1) ||
      !Array.isArray(respuesta.quizzes) || respuesta.quizzes.length === 0) {
      throw new Error(`No se generaron suficientes lecciones o quizzes. Se esperaban al menos ${leccionesEsperadas.length > 0 ? leccionesEsperadas.length : 1} lecciones y 1 quiz.`);
    }
    
    // Validación opcional para los títulos de las lecciones iniciales
    if (leccionesEsperadas.length > 0) {
      for (let i = 0; i < leccionesEsperadas.length; i++) {
        if (!respuesta.lecciones[i] || respuesta.lecciones[i].titulo !== leccionesEsperadas[i]) {
          console.warn(`Advertencia: El título de la lección ${i + 1} ("${respuesta.lecciones[i]?.titulo}") no coincide con el esperado ("${leccionesEsperadas[i]}"). La IA pudo haberlo modificado.`);
          // Podrías lanzar un error aquí si es crítico:
          // throw new Error(`El título de la lección ${i + 1} no coincide con el esperado.`);
        }
      }
    }


    if (!respuesta.curso.titulo || !respuesta.curso.descripcion ||
      !respuesta.curso.duracionHoras) {
      throw new Error('Faltan datos requeridos en el curso (título, descripción, duración).');
    }

    return respuesta;
  }
}

module.exports = new AIService();
// --- END OF FILE services/ai.service.js ---