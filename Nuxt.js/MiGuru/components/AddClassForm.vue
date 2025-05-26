<template>
  <form @submit.prevent="submitForm" class="bg-white shadow p-4 rounded">
    <div class="mb-4">
      <label for="title" class="block text-sm font-bold">Título</label>
      <input id="title" v-model="title" type="text" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="description" class="block text-sm font-bold">Descripción</label>
      <textarea id="description" v-model="description" class="w-full border rounded p-2"></textarea>
    </div>
    <div class="mb-4">
      <label for="image" class="block text-sm font-bold">Imagen del Curso</label>
      <input id="image" type="file" @change="handleFileUpload" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="lessons" class="block text-sm font-bold">Cantidad de Lecciones</label>
      <input id="lessons" v-model="lessons" type="number" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="quizzes" class="block text-sm font-bold">Cantidad de Quizzes</label>
      <input id="quizzes" v-model="quizzes" type="number" class="w-full border rounded p-2" />
    </div>
    <div class="mb-4">
      <label for="author" class="block text-sm font-bold">Autor del Curso</label>
      <input id="author" v-model="author" type="text" class="w-full border rounded p-2" />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['course-added']);

const title = ref('');
const description = ref('');
const image = ref(null);
const lessons = ref(0);
const quizzes = ref(0);
const author = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
  }
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('image', image.value);
  formData.append('lessons', lessons.value);
  formData.append('quizzes', quizzes.value);
  formData.append('author', author.value);

  await fetch('/api/classes', {
    method: 'POST',
    body: formData
  });

  emit('course-added');

  // Opcional: limpia el formulario
  title.value = '';
  description.value = '';
  image.value = null;
  lessons.value = 0;
  quizzes.value = 0;
  author.value = '';
};
</script>