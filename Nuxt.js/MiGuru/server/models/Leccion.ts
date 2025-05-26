import mongoose from 'mongoose';

const leccionSchema = new mongoose.Schema({
  titulo: String,
  contenido: Object,
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  orden: Number,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.Leccion || mongoose.model('Leccion', leccionSchema, 'leccions');