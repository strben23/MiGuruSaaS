import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  titulo: String,
  preguntas: Array,
  respuestas: Array,
  calificacion: Number,
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema, 'quizzes');