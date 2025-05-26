// --- START OF FILE crearCursoAPI.js ---
import express from 'express';
// Asegúrate que la ruta a crearCurso.js sea correcta
// Si crearCurso.js está en el mismo directorio:
// const { ejecutarCreacionCurso } = require('./crearCurso');
// Si está en un subdirectorio (ej. scripts/crearCurso.js):
const { ejecutarCreacionCurso } = require('../crearCurso'); // Ajusta la ruta según tu estructura

const app = express();
app.use(express.json());

app.post('/api/crear-curso', async (req, res) => { // <-- MODIFICADO: async
  try {
    const { tituloCurso, leccionesIniciales } = req.body; // <-- MODIFICADO

    if (!tituloCurso || typeof tituloCurso !== 'string' || tituloCurso.trim() === '') {
      return res.status(400).json({ error: "El 'tituloCurso' es obligatorio y debe ser un string." });
    }

    // Validar leccionesIniciales (opcional pero recomendado)
    if (leccionesIniciales && (!Array.isArray(leccionesIniciales) || leccionesIniciales.some(t => typeof t !== 'string'))) {
      return res.status(400).json({ error: "'leccionesIniciales' debe ser un array de strings." });
    }
    // Asegurarse que sean máximo 3 o las que esperes.
    const primerasLecciones = leccionesIniciales ? leccionesIniciales.slice(0, 3) : [];


    // El nombre del parámetro en req.body.platform era "deepseek", asumo que querías el título del curso.
    // Si "platform" es otro dato, ajústalo. Aquí usaré tituloCurso y leccionesIniciales.
    const result = await ejecutarCreacionCurso(tituloCurso, primerasLecciones); // <-- MODIFICADO
    res.json({ ok: true, message: result.message, cursoId: result.cursoId }); // <-- MODIFICADO: mejor respuesta
  } catch (e) {
    console.error("Error en API /api/crear-curso:", e);
    res.status(500).json({ error: e.message || "Error interno del servidor al crear el curso." });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Microservicio corriendo en ${PORT}`));
// --- END OF FILE crearCursoAPI.js ---