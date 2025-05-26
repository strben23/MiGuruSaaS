<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const course = ref(null);

onMounted(async () => {
  const res = await fetch(`/api/classes/${route.params.id}`);
  course.value = await res.json();
});
</script>

<template>
  <div v-if="course">
    <NuxtLink
      to="/dashboard"
      class="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      ← Volver al Dashboard
    </NuxtLink>
    <h1 class="text-3xl font-bold mb-4">{{ course.titulo }}</h1>
    <p class="mb-2"><strong>Descripción:</strong> {{ course.descripcion }}</p>
    <p class="mb-2"><strong>Duración:</strong> {{ course.duracionHoras }}</p>
    <p class="mb-2"><strong>Publicado:</strong> {{ course.publicado ? 'Sí' : 'No' }}</p>
    <p class="mb-2"><strong>Fecha de Creación:</strong> {{ course.fechaCreacion }}</p>
    <div class="mb-4">
      <strong>Lecciones:</strong>
      <ul>
        <li v-for="leccion in course.lecciones" :key="leccion._id">
          {{ leccion.titulo }}
        </li>
      </ul>
    </div>
    <div>
      <strong>Quizzes:</strong>
      <ul>
        <li v-for="quiz in course.quizzes" :key="quiz._id">
          {{ quiz.titulo }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <p>Cargando información del curso...</p>
  </div>
</template>