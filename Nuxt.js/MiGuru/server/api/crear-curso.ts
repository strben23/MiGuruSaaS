// --- START OF FILE server/api/crear-curso.ts ---

import { defineEventHandler, readBody } from 'h3';
import { connectDB } from '../utils/mongoose'; // Ajusta la ruta si es necesario
// Asegúrate que la importación de 'microservicio-creacion-cursos' sea correcta
// Si es un paquete npm:
import { ejecutarCreacionCurso } from 'microservicio-creacion-cursos';
// Si es un archivo local, la ruta debe ser relativa y correcta:
// import { ejecutarCreacionCurso } from '../../microservicio-creacion-cursos/crearCurso'; // Ejemplo

export default defineEventHandler(async (event) => {
  try {
    // Leer el cuerpo de la solicitud
    const body = await readBody(event);
    const { tituloCurso, leccionesIniciales } = body; // <--- MODIFICADO para recibir los nuevos campos

    if (!tituloCurso) {
      event.node.res.statusCode = 400; // Establecer código de estado para errores del cliente
      return { ok: false, error: 'El "tituloCurso" es obligatorio.' };
    }

    // Validar leccionesIniciales (opcional pero recomendado)
    if (leccionesIniciales && (!Array.isArray(leccionesIniciales) || leccionesIniciales.some(t => typeof t !== 'string'))) {
      event.node.res.statusCode = 400;
      return { ok: false, error: "'leccionesIniciales' debe ser un array de strings." };
    }

    await connectDB();

    console.log(`API: Recibido para crear curso: ${tituloCurso}`, leccionesIniciales);

    // Llamar a la función que genera el curso con la IA
    // Esta función debe retornar el ID del curso creado o más info
    const resultadoCreacion = await ejecutarCreacionCurso(tituloCurso, leccionesIniciales || []); // <--- MODIFICADO

    // `ejecutarCreacionCurso` debería devolver algo como { success: true, message: "...", cursoId: "..." }
    if (resultadoCreacion && resultadoCreacion.success) {
        console.log("API: Curso creado exitosamente por el microservicio", resultadoCreacion);
        return {
            ok: true,
            message: resultadoCreacion.message || "Curso generado y guardado exitosamente.",
            cursoId: resultadoCreacion.cursoId // Asegúrate que esto se devuelva
        };
    } else {
        console.error("API: Error desde ejecutarCreacionCurso", resultadoCreacion);
        event.node.res.statusCode = 500;
        return {
            ok: false,
            error: resultadoCreacion.message || "Error al generar el contenido del curso con IA."
        };
    }

  } catch (e: any) { // Especificar 'any' o 'unknown' y luego verificar
    console.error('Error en API /api/crear-curso:', e);
    event.node.res.statusCode = 500; // Error interno del servidor
    return {
      ok: false,
      error: e.message || 'Error inesperado en el servidor al procesar la solicitud.'
    };
  }
});
// --- END OF FILE server/api/crear-curso.ts ---