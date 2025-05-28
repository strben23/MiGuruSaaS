<!-- pages/cursos/[id].vue -->
<template>
  <div v-if="layout === 'dashboardlayout'" class="p-4 sm:p-6 md:p-8"> <!-- Padding si usa dashboardlayout -->
    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin mx-auto h-12 w-12 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg text-slate-400">Cargando información del curso...</p>
    </div>

    <div v-else-if="error" class="mt-6 p-6 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
      <h2 class="text-xl font-semibold mb-2">Error al Cargar el Curso</h2>
      <p>{{ error.message || error }}</p>
      <NuxtLink to="/dashboard" class="inline-block mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md">
        Volver al Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="course" class="max-w-4xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/dashboard" class="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Dashboard
        </NuxtLink>
      </div>

      <header class="mb-8 p-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-sky-400 mb-1">{{ course.titulo }}</h1>
            <p class="text-sm text-slate-400">
              Duración: {{ course.duracionHoras }} |
              <span :class="course.publicado ? 'text-green-400' : 'text-amber-400'">
                {{ course.publicado ? 'Publicado' : 'Borrador' }}
              </span>
              | Creado: {{ formatDate(course.fechaCreacion || course.createdAt) }}
            </p>
          </div>
          <NuxtLink
            :to="`/cursos/${course._id}/detalle-completo`"
            class="shrink-0 inline-flex items-center px-4 py-2 border border-sky-600 text-sm font-medium rounded-md text-sky-300 bg-sky-700/30 hover:bg-sky-600/50 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
          >
            Ver Detalles Completos
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </NuxtLink>
        </div>
        <p class="mt-4 text-slate-300 leading-relaxed">{{ course.descripcion }}</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sección de Lecciones (Resumen) -->
        <section class="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h2 class="text-xl font-semibold text-sky-400 mb-4">Lecciones ({{ course.lecciones?.length || 0 }})</h2>
          <ul v-if="course.lecciones && course.lecciones.length" class="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <li v-for="leccion in course.lecciones" :key="leccion._id" class="p-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-sky-600 transition-colors">
              <h3 class="font-medium text-slate-200">{{ leccion.titulo }}</h3>
              <p v-if="leccion.contenido && leccion.contenido.video" class="text-xs text-slate-400">
                Video: {{ leccion.contenido.video.duracion }}
              </p>
            </li>
          </ul>
          <p v-else class="text-slate-400 text-sm">No hay lecciones asignadas a este curso.</p>
        </section>

        <!-- Sección de Quizzes (Resumen) -->
        <section class="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h2 class="text-xl font-semibold text-sky-400 mb-4">Quizzes ({{ course.quizzes?.length || 0 }})</h2>
          <ul v-if="course.quizzes && course.quizzes.length" class="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <li v-for="quiz in course.quizzes" :key="quiz._id" class="p-3 bg-slate-700/50 rounded-md border border-slate-600 hover:border-sky-600 transition-colors">
              <h3 class="font-medium text-slate-200">{{ quiz.titulo }}</h3>
              <p v-if="quiz.preguntas" class="text-xs text-slate-400">
                {{ quiz.preguntas.length }} Preguntas
              </p>
            </li>
          </ul>
          <p v-else class="text-slate-400 text-sm">No hay quizzes asignados a este curso.</p>
        </section>
      </div>
    </div>
    <div v-else class="text-center py-20 text-slate-400">
      Curso no encontrado.
    </div>
  </div>
  <div v-else class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 sm:p-6 md:p-8">
      <p>Cargando curso... (layout alternativo)</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const layout = computed(() => route.meta.layout || 'default');

definePageMeta({
  layout: 'dashboardlayout',
});

const course = ref(null);
const isLoading = ref(true);
const error = ref(null);
const courseId = useRoute().params.id;

const fetchCourseDetails = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // **** CORRECCIÓN AQUÍ ****
    // Cambiado de /api/cursos/${courseId} a /api/classes/${courseId}
    const data = await $fetch(`/api/classes/${courseId}`);
    if (data && !data.error) {
      course.value = data;
    } else {
      error.value = data?.error || 'Curso no encontrado.';
      course.value = null;
    }
  } catch (err) {
    console.error("Error fetching course details:", err);
    error.value = err.data?.error || err.message || "Error al cargar los datos del curso.";
    course.value = null;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

onMounted(() => {
  if (courseId) {
    fetchCourseDetails();
  } else {
    error.value = "No se proporcionó ID de curso.";
    isLoading.value = false;
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: theme('colors.slate.700');
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.sky.600');
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: theme('colors.sky.500');
}
</style>