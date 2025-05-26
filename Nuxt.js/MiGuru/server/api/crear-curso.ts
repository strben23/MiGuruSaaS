import { defineEventHandler, readBody } from 'h3';
import { connectDB } from '../utils/mongoose';
import {ejecutarCreacionCurso} from 'C:/Users/Gaelp/Documents/UABC/IS/creacionCursos.js/MicroservicioCreacionCursos/crearCurso';


export default defineEventHandler(async (event) => {
  try {
    const { titulo, descripcion, duracionHoras, publicado, fechaCreacion } = await readBody(event);
    if (!titulo) return { error: 'Título requerido' };
    await connectDB();

    // Crea el curso solo con los datos recibidos del body
    const nuevoCurso = await ejecutarCreacionCurso(titulo);


    return { ok: true};
  } catch (e) {
    console.error('Error en crear-curso:', e);
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Error inesperado' };
  }
});