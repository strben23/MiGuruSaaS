pages/cursos/[id]/detalle-completo.vue
<template>
  <div v-if="layout === 'dashboardlayout'" class="p-4 sm:p-6 md:p-8">
    <div v-if="isLoading" class="text-center py-20">
      <svg class="animate-spin mx-auto h-12 w-12 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg text-slate-400">Cargando detalles completos del curso...</p>
    </div>
    <div v-else-if="error" class="mt-6 p-6 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
      <h2 class="text-xl font-semibold mb-2">Error al Cargar el Curso</h2>
      <p>{{ error.message || error }}</p>
      <NuxtLink :to="`/cursos/${courseId}`" class="inline-block mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md">
        Volver a la Vista General
      </NuxtLink>
    </div>
    <div v-else-if="course" class="max-w-5xl mx-auto">
      <div class="mb-6">
        <NuxtLink :to="`/cursos/${course._id}`" class="inline-flex items-center text-sm text-sky-400 hover:text-sky-300 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Vista General del Curso
        </NuxtLink>
      </div>

      <header class="mb-8 p-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
        <h1 class="text-3xl md:text-4xl font-bold text-sky-400 mb-1">{{ course.titulo }} - Detalles Completos</h1>
        <p class="text-sm text-slate-400">
          Duración: {{ course.duracionHoras }} |
          <span :class="course.publicado ? 'text-green-400' : 'text-amber-400'">
            {{ course.publicado ? 'Publicado' : 'Borrador' }}
          </span>
        </p>
         <p class="mt-3 text-slate-300 leading-relaxed">{{ course.descripcion }}</p>
      </header>

      <!-- Sección Detallada de Lecciones -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-sky-400 mb-5 border-b border-slate-700 pb-2">
          Lecciones Detalladas ({{ course.lecciones?.length || 0 }})
        </h2>
        <div v-if="course.lecciones && course.lecciones.length" class="space-y-6">
          <article v-for="(leccion, index) in course.lecciones" :key="leccion._id" class="p-5 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <h3 class="text-xl font-semibold text-sky-300 mb-2">
              {{ index + 1 }}. {{ leccion.titulo }}
              <span class="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">Orden: {{ leccion.orden }}</span>
            </h3>
            <div class="prose prose-sm prose-invert max-w-none text-slate-300">
              <p v-if="leccion.contenido?.texto" v-html="renderMarkdown(leccion.contenido.texto)"></p>
              <p v-else class="italic text-slate-500">Sin contenido textual.</p>

              <div v-if="leccion.contenido?.video" class="mt-3">
                <h4 class="font-semibold text-slate-200">Video:</h4>
                <YoutubePlayer v-if="leccion.contenido.video.url" :video-id="leccion.contenido.video.url.split('v=')[1]" class="w-full h-64 mb-3" />
                <p>URL: <a :href="leccion.contenido.video.url" target="_blank" class="text-sky-400 hover:underline">{{ leccion.contenido.video.url }}</a></p>
                <p>Duración: {{ leccion.contenido.video.duracion }}</p>
              </div>

              <div v-if="leccion.contenido?.recursos && leccion.contenido.recursos.length" class="mt-3">
                <h4 class="font-semibold text-slate-200">Recursos Adicionales:</h4>
                <ul class="list-disc list-inside ml-1 space-y-1">
                  <li v-for="recurso in leccion.contenido.recursos" :key="recurso.url">
                    <a :href="recurso.url" target="_blank" class="text-sky-400 hover:underline">
                      {{ recurso.nombre }} ({{ recurso.tipo }})
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="text-slate-400">No hay lecciones para mostrar con detalle.</p>
      </section>

      <!-- Sección Detallada de Quizzes -->
      <section>
        <h2 class="text-2xl font-semibold text-sky-400 mb-5 border-b border-slate-700 pb-2">
          Quizzes Detallados ({{ course.quizzes?.length || 0 }})
        </h2>
        <div v-if="course.quizzes && course.quizzes.length" class="space-y-6">
          <article v-for="quiz in course.quizzes" :key="quiz._id" class="p-5 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
            <h3 class="text-xl font-semibold text-sky-300 mb-3">{{ quiz.titulo }}</h3>
            <div class="text-slate-300 space-y-2">
              <h4 class="font-semibold text-slate-200">Preguntas y Respuestas:</h4>
              <ul v-if="quiz.preguntas && quiz.preguntas.length" class="list-decimal list-inside ml-1 space-y-1">
                <li v-for="(pregunta, index) in quiz.preguntas" :key="index">
                  <strong>P:</strong> {{ pregunta }}
                  <br>
                  <span class="ml-4 text-green-400"><strong>R:</strong> {{ quiz.respuestas[index] || 'Sin respuesta asignada' }}</span>
                </li>
              </ul>
              <p v-else class="italic text-slate-500">Este quiz no tiene preguntas.</p>
              <p class="mt-2 text-sm">Calificación obtenida: {{ quiz.calificacion ?? 'N/A' }} / 100</p>
            </div>
          </article>
        </div>
        <p v-else class="text-slate-400">No hay quizzes para mostrar con detalle.</p>
      </section>
    </div>
     <div v-else class="text-center py-20 text-slate-400">
      Curso no encontrado.
    </div>
  </div>
  <div v-else class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 sm:p-6 md:p-8">
      <p>Cargando detalles del curso... (layout alternativo)</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';

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
    console.error("Error fetching course details for full view:", err);
    error.value = err.data?.error || err.message || "Error al cargar los datos del curso.";
    course.value = null;
  } finally {
    isLoading.value = false;
  }
};

const renderMarkdown = (text) => {
  if (!text) return '';
  return marked.parse(text);
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
.prose-invert {
  --tw-prose-body: theme('colors.slate.300');
  --tw-prose-headings: theme('colors.slate.100');
  --tw-prose-links: theme('colors.sky.400');
  --tw-prose-bold: theme('colors.slate.100');
  --tw-prose-bullets: theme('colors.slate.600');
  --tw-prose-hr: theme('colors.slate.700');
  --tw-prose-pre-code: theme('colors.slate.300');
  --tw-prose-pre-bg: theme('colors.slate.800');
}
</style>