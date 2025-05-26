import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  duracionHoras: String,
  publicado: Boolean,
  fechaCreacion: Date,
  lecciones: Array,
  quizzes: Array,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema, 'cursos');