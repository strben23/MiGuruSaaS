import { defineEventHandler, readMultipartFormData, readBody } from 'h3';
import { promises as fs } from 'fs';
import path from 'path';
import Course from '../../server/models/Course';    
import Leccion from '../../server/models/Leccion';
import Quiz from '../../server/models/Quiz';
import { connectDB } from '../../server/utils/mongoose';

export default defineEventHandler(async (event) => {
  await connectDB();

  const { req } = event;
  const url = req.url || '';
  const idMatch = url.match(/\/api\/classes\/(\w+)/);
  const id = idMatch ? idMatch[1] : null;

  if (req.method === 'GET') {
    const courses = await Course.find();
    return courses;
  }

  if (req.method === 'POST') {
    const formData = await readMultipartFormData(event);
    const body: Record<string, string> = {};
    let imageUrl = '';

    if (formData) {
      for (const field of formData) {
        if (field.type) {
          const uploadDir = path.resolve('public/uploads');
          await fs.mkdir(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, field.filename || 'uploaded-file');
          await fs.writeFile(filePath, field.data);
          imageUrl = `/uploads/${field.filename}`;
        } else if (field.name && field.data) {
          body[field.name] = field.data.toString();
        }
      }
    }

    const newCourse = await Course.create({
      title: body.title,
      description: body.description,
      image: imageUrl,
      lessons: parseInt(body.lessons, 10),
      quizzes: parseInt(body.quizzes, 10),
      author: body.author
    });
    return newCourse;
  }

  if (req.method === 'PUT' && id) {
    const updated = await readBody(event);
    const course = await Course.findByIdAndUpdate(id, updated, { new: true });
    if (!course) {
      event.res.statusCode = 404;
      return { error: 'Curso no encontrado' };
    }
    return course;
  }

  if (req.method === 'DELETE' && id) {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      event.res.statusCode = 404;
      return { error: 'Curso no encontrado' };
    }
    return { success: true };
  }
});