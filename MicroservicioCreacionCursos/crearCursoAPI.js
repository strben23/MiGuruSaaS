import express from 'express';
//const { crearCurso } = require('crearCurso');

const app = express();
app.use(express.json());

app.post('/api/crear-curso', (req, res) => {
  try {
    const result = crearCurso.ejecutarCreacionCurso(req.body.platform || "deepseek");
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3002, () => console.log('Microservicio corriendo en 3002'));