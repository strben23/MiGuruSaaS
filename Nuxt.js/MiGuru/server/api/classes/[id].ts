import { defineEventHandler, getRouterParam } from 'h3';
import Course from '../../models/Course';
import Leccion from '../../models/Leccion';
import Quiz from '../../models/Quiz';
import { connectDB } from '../../utils/mongoose';

export default defineEventHandler(async (event) => {
  await connectDB();
  const id = getRouterParam(event, 'id');
  if (!id) return { error: 'ID no proporcionado' };

  const course = await Course.findById(id).lean();
  if (!course) return { error: 'Curso no encontrado' };

  // Buscar lecciones y quizzes que tengan el campo curso igual al id del curso
  const lecciones = await Leccion.find({ curso: id });
  const quizzes = await Quiz.find({ curso: id });

  return { ...course, lecciones, quizzes };
});